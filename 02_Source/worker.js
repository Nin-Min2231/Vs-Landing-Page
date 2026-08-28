// Cloudflare Worker — việc nền cho trang quản trị Top Visa 5S (xem CLAUDE.md mục 33) + API Chat Box
// trang Home (xem CLAUDE.md mục "Chat Box"/08_Chatbox/, Release 1, 2026-08-28).
//
// 1) fetch(): route '/api/chat' (POST) -> handleChat() (Chat Box); MỌI request khác GIỮ NGUYÊN hành
//    vi phục vụ file tĩnh cũ (index.html/admin.html/assets/...) — không đổi gì với khách truy cập
//    landing page hay admin đăng nhập bình thường.
// 2) scheduled(): chạy định kỳ theo [triggers] crons trong wrangler.toml — quét ho_so/leads,
//    tự tạo "thông báo" mới (bảng notifications) rồi gửi Web Push tới các thiết bị đã đăng ký
//    (bảng push_subscriptions), để chuông thông báo trong admin.html luôn có dữ liệu mới NGAY CẢ
//    KHI không ai đang mở trang, và điện thoại nhận được thông báo dù đã tắt hẳn trình duyệt/app.
//
// Bắt buộc chạy bằng SUPABASE_SERVICE_ROLE_KEY (không phải anon key) vì cần đọc/ghi bỏ qua RLS.
// Khóa này CHỈ được đặt qua Cloudflare Dashboard (Worker → Settings → Variables → "Encrypt"),
// KHÔNG BAO GIỜ được ghi vào file này hay bất kỳ file nào khác trong git (xem CLAUDE.md mục 10).

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }
    return env.ASSETS.fetch(request); // hành vi cũ — GIỮ NGUYÊN cho mọi request khác
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runNotificationJob(env));
  }
};

/* ==================== GỌI SUPABASE BẰNG SERVICE ROLE (bỏ qua RLS) ====================
   SUPABASE_URL hardcode thẳng ở đây (PHẢI khớp y hệt hằng số cùng tên trong index.html/admin.html)
   — giá trị này vốn đã công khai (ai mở View Source trang chủ cũng thấy), không cần đặt thành
   biến môi trường trên Cloudflare nữa, tránh lặp lại sự cố "quên thêm 1 biến nên job im lặng
   không chạy gì" (đã gặp thật lúc set up lần đầu — xem CLAUDE.md mục 33). ==================== */
const SUPABASE_URL = "https://vvnjxvcdnzttcdufjjgo.supabase.co";
async function supa(env, path, opts = {}) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': 'Bearer ' + env.SUPABASE_SERVICE_ROLE_KEY,
      'Prefer': opts.prefer || 'return=representation',
      ...(opts.headers || {})
    }
  });
  if (!res.ok) throw new Error('Supabase ' + path + ' -> HTTP ' + res.status + ': ' + await res.text());
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

/* ==================== BƯỚC 1: SINH THÔNG BÁO MỚI (bỏ qua nếu đã có) ====================
   "Hôm nay" tính theo giờ VIỆT NAM (UTC+7), khớp đúng cách admin.html tính "hôm nay" ở
   Dashboard/Hồ sơ (hàm tcToday()) — tránh 2 nơi lệch ngày nhau. (2026-08, sửa lại: bản cũ tính
   thẳng theo UTC nên từ 0h-7h sáng giờ VN mốc UTC vẫn là "ngày hôm qua", khiến cả tô đỏ trên
   Dashboard lẫn thông báo bị trễ tới 7h sáng mới đúng — PM phản hồi thật gặp lúc 6h30 sáng.) */
/* Quét lùi thêm mấy ngày (2026-08, "lớp an toàn bắt lại thông báo bị bỏ sót") — nếu Worker/khóa
   Supabase bị lỗi vài ngày (sự cố thật đã gặp 12-14/8/2026 do sai SUPABASE_SERVICE_ROLE_KEY, xem
   CLAUDE.md mục 38), trước đây chỉ hỏi "=hôm nay" nên qua ngày là MẤT VĨNH VIỄN, không có cách nào
   tự bắt lại. Giờ hỏi "trong N ngày gần nhất" — AN TOÀN để nới rộng vì ràng buộc unique
   (loai,ref_id,ref_ngay) + resolution=ignore-duplicates ở bước upsert phía dưới đã tự chặn tạo
   trùng cho combo đã từng thông báo thành công; nới ngày chỉ giúp BẮT THÊM đúng phần còn thiếu. */
const BACKFILL_DAYS = 7;
function isoDaysAgo(todayIso, days) {
  const d = new Date(todayIso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
async function generateNewNotifications(env) {
  const today = new Date(Date.now() + 7 * 3600 * 1000).toISOString().slice(0, 10);
  const backfillFrom = isoDaysAgo(today, BACKFILL_DAYS);
  const candidates = [];

  // Mỗi loại bọc try/catch RIÊNG — 1 loại lỗi (vd sai cú pháp filter, đổi schema...) không được
  // phép làm im lặng luôn 2 loại còn lại (bài học thật từ lúc set up lần đầu, xem CLAUDE.md mục 33).
  try {
    // 'tra_kq': hồ sơ có ngay_tra_kq trong N ngày gần nhất (đến hết hôm nay), còn "Đã nộp"/"Đang xử
    // lý" — khớp đúng điều kiện khối "Hồ sơ trả kết quả tuần này" ở Dashboard (CLAUDE.md mục 31.A)
    // CỘNG THÊM lớp bắt lại thông báo cũ bị bỏ sót (xem comment BACKFILL_DAYS ở trên).
    const hoSoRows = await supa(env,
      'ho_so?select=id,ten_khach,ngay_tra_kq,danh_muc_nuoc(ten)' +
      '&ngay_tra_kq=gte.' + backfillFrom + '&ngay_tra_kq=lte.' + today +
      '&trang_thai=in.' + encodeURIComponent('("Đã nộp","Đang xử lý")'));
    for (const h of hoSoRows || []) {
      candidates.push({
        loai: 'tra_kq', ref_table: 'ho_so', ref_id: h.id, ref_parent_id: null, ref_ngay: h.ngay_tra_kq,
        noi_dung: (h.ten_khach || 'Khách hàng') + '_ Visa ' + (h.danh_muc_nuoc?.ten || 'chưa rõ')
      });
    }
  } catch (e) { console.error('generateNewNotifications tra_kq lỗi:', e); }

  try {
    // 'nhac_tuvan': lead có ngay_nhac_lai trong N ngày gần nhất — không lọc trạng thái, khớp view
    // có sẵn v_tu_van_can_nhac_lai (05_Database/02_supabase_setup_phase2.sql) + bắt lại bị bỏ sót.
    const nhacLaiRows = await supa(env,
      'leads?select=id,name,country,ngay_nhac_lai&ngay_nhac_lai=gte.' + backfillFrom + '&ngay_nhac_lai=lte.' + today);
    for (const l of nhacLaiRows || []) {
      candidates.push({
        loai: 'nhac_tuvan', ref_table: 'leads', ref_id: l.id, ref_parent_id: null, ref_ngay: l.ngay_nhac_lai,
        noi_dung: (l.name || 'Khách hàng') + '_ Visa ' + (l.country || 'chưa rõ')
      });
    }
  } catch (e) { console.error('generateNewNotifications nhac_tuvan lỗi:', e); }

  try {
    // 'dang_ky_moi': khách tự đăng ký — từ form công khai index.html (nguon='Từ Web') HOẶC từ Chat
    // Box trang Home (nguon='Từ Chatbot', thêm 2026-08-28, xem 08_Chatbox/). Giới hạn 200 dòng mới
    // nhất — đủ rộng để không bỏ sót nếu Worker lỡ dừng vài ngày, vẫn nhẹ cho DB; dòng đã có thông
    // báo rồi tự bị bỏ qua nhờ ràng buộc unique khi upsert bên dưới.
    const moiRows = await supa(env,
      'leads?select=id,name,country,created_at&nguon=in.' + encodeURIComponent('("Từ Web","Từ Chatbot")') +
      '&order=created_at.desc&limit=200');
    for (const l of moiRows || []) {
      candidates.push({
        loai: 'dang_ky_moi', ref_table: 'leads', ref_id: l.id, ref_parent_id: null,
        ref_ngay: (l.created_at || '').slice(0, 10),
        noi_dung: (l.name || 'Khách hàng') + '_ Visa ' + (l.country || 'chưa rõ')
      });
    }
  } catch (e) { console.error('generateNewNotifications dang_ky_moi lỗi:', e); }

  try {
    // 'xlps': xử lý phát sinh (trong dialog Hồ sơ) có han_chot trong N ngày gần nhất, còn "Đang xử
    // lý" — khớp đúng điều kiện view v_xu_ly_phat_sinh_7_ngay (chỉ tính khi chưa Hủy/Tạm dừng/Hoàn
    // thành) + bắt lại bị bỏ sót. ref_id PHẢI là id của chính dòng xử lý phát sinh (không phải
    // ho_so_id) để 2 dòng xử lý phát sinh khác nhau cùng hạn chốt trên 1 hồ sơ vẫn tạo được 2
    // thông báo riêng — ref_parent_id lưu ho_so_id để admin.html biết mở đúng Hồ sơ nào.
    const xlpsRows = await supa(env,
      'ho_so_xu_ly_phat_sinh?select=id,ho_so_id,noi_dung,han_chot,ho_so(ten_khach,danh_muc_nuoc(ten))' +
      '&han_chot=gte.' + backfillFrom + '&han_chot=lte.' + today +
      '&trang_thai=eq.' + encodeURIComponent('Đang xử lý'));
    for (const x of xlpsRows || []) {
      candidates.push({
        loai: 'xlps', ref_table: 'ho_so_xu_ly_phat_sinh', ref_id: x.id, ref_parent_id: x.ho_so_id,
        ref_ngay: x.han_chot,
        noi_dung: (x.ho_so?.ten_khach || 'Khách hàng') + '_' + (x.ho_so?.danh_muc_nuoc?.ten || 'chưa rõ') +
          '_ ' + x.noi_dung
      });
    }
  } catch (e) { console.error('generateNewNotifications xlps lỗi:', e); }

  if (!candidates.length) return [];

  // Upsert bỏ qua trùng (unique loai+ref_id+ref_ngay) — Prefer return=representation kết hợp
  // resolution=ignore-duplicates chỉ trả về ĐÚNG những dòng MỚI vừa được tạo thật sự (dòng bị bỏ
  // qua do trùng không xuất hiện trong response) — nhờ đó biết chính xác dòng nào cần gửi push.
  const inserted = await supa(env, 'notifications?on_conflict=loai,ref_id,ref_ngay', {
    method: 'POST',
    body: JSON.stringify(candidates),
    prefer: 'return=representation,resolution=ignore-duplicates'
  });
  return inserted || [];
}

/* ==================== BƯỚC 2: GỬI WEB PUSH CHO CÁC DÒNG MỚI ==================== */
async function pushToAllSubscriptions(env, newRows) {
  if (!newRows.length) return;
  const subs = await supa(env, 'push_subscriptions?select=*');
  if (!subs || !subs.length) return;

  for (const sub of subs) {
    try {
      await sendWebPush(env, sub);
    } catch (e) {
      // 404/410 = thiết bị đã gỡ đăng ký/subscription hết hạn phía trình duyệt -> dọn khỏi DB.
      if (e && (e.status === 404 || e.status === 410)) {
        await supa(env, 'push_subscriptions?id=eq.' + sub.id, { method: 'DELETE', prefer: 'return=minimal' }).catch(() => {});
      }
    }
  }

  // Đánh dấu đã "cố gắng gửi" — không cần biết mỗi thiết bị nhận thành công hay chưa, vì badge/
  // list trong admin.html luôn đúng do đọc thẳng từ notifications, không phụ thuộc push tới nơi.
  const ids = newRows.map(r => r.id);
  await supa(env, 'notifications?id=in.(' + ids.join(',') + ')', {
    method: 'PATCH', body: JSON.stringify({ pushed_at: new Date().toISOString() }), prefer: 'return=minimal'
  });
}

async function runNotificationJob(env) {
  if (!env || !env.SUPABASE_SERVICE_ROLE_KEY) return; // chưa cấu hình secret
  const newRows = await generateNewNotifications(env);
  if (env.VAPID_PRIVATE_KEY_JWK) {
    try {
      await pushToAllSubscriptions(env, newRows);
    } catch (e) { console.error('pushToAllSubscriptions lỗi:', e); }
  }
}

/* ==================== WEB PUSH (silent — không kèm nội dung) ====================
   Gửi push RỖNG (không payload) kèm chữ ký VAPID, chỉ để "đánh thức" trình duyệt/thiết bị.
   sw-admin.js nhận được sẽ tự làm mới access token bằng refresh token đã lưu rồi gọi API lấy nội
   dung thông báo chưa đọc mới nhất để hiển thị — tránh phải tự mã hóa payload Web Push (chuẩn
   RFC8291, rất dễ sai mà không có thiết bị thật để kiểm chứng từng bước). ====================
   VAPID_PUBLIC_KEY hardcode thẳng ở đây (PHẢI khớp y hệt hằng số VAPID_PUBLIC_KEY trong
   admin.html) — khóa này CÔNG KHAI theo đúng thiết kế Web Push, không cần giữ bí mật/không cần
   đặt làm Cloudflare secret, nên gộp làm 1 chỗ duy nhất để không có cơ hội gõ lệch giữa 2 nơi. */
const VAPID_PUBLIC_KEY = "BDjloPaK8oztgLzXMhejaX4_Ytw9i5cKbJFuIm3Gjgd_ukYXhKo5siKUGdkvjHHB8-PruG0A8iLto2U2ItxaPNI";
let vapidKeyPromise = null;
function getVapidPrivateKey(env) {
  if (!vapidKeyPromise) {
    vapidKeyPromise = crypto.subtle.importKey(
      'jwk', JSON.parse(env.VAPID_PRIVATE_KEY_JWK),
      { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
    );
  }
  return vapidKeyPromise;
}
function b64url(buf) {
  let bin = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function buildVapidAuthHeader(env, endpoint) {
  const aud = new URL(endpoint).origin;
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: env.VAPID_SUBJECT || 'mailto:hien.gotravel@gmail.com'
  };
  const unsigned = b64url(new TextEncoder().encode(JSON.stringify(header))) + '.' +
    b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await getVapidPrivateKey(env);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(unsigned));
  const jwt = unsigned + '.' + b64url(sig);
  return 'vapid t=' + jwt + ', k=' + VAPID_PUBLIC_KEY;
}
async function sendWebPush(env, sub) {
  const auth = await buildVapidAuthHeader(env, sub.endpoint);
  const res = await fetch(sub.endpoint, {
    method: 'POST',
    headers: { 'TTL': '3600', 'Authorization': auth }
  });
  if (!res.ok) {
    const err = new Error('push endpoint -> HTTP ' + res.status);
    err.status = res.status;
    throw err;
  }
}

/* ==================== CHAT BOX — route /api/chat (Release 1, 2026-08-28) ====================
   Xem 08_Chatbox/Dac_ta_Trien_khai_Chatbox.md mục 5 (nguồn spec đầy đủ). Tóm tắt luồng handleChat():
   1. Rate limit theo IP (bộ nhớ tạm trong isolate — best-effort, đủ dùng cho quy mô nhỏ hiện tại).
   2. Ghi tin nhắn khách vào chat_logs.
   3. Nhận diện SĐT hợp lệ trong tin nhắn -> tạo lead (nguon='Từ Chatbot') nếu phiên này CHƯA có lead.
   4. Đọc dữ liệu Visa thật (danh_muc_nuoc/dich_vu_gia) bằng service role, ghép system prompt, gọi
      Cloudflare Workers AI (env.AI.run) — lỗi/hết quota thì rơi về tin nhắn fallback tĩnh, KHÔNG
      throw lỗi trắng trang.
   5. Ghi tin nhắn trả lời vào chat_logs, trả JSON { reply, lang, lead_captured } về client. ==== */

const CHAT_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast'; // model đa ngôn ngữ, nhẹ, phù hợp free tier
const CHAT_RATE_LIMIT_MAX = 8;          // tối đa 8 câu hỏi
const CHAT_RATE_LIMIT_WINDOW_MS = 60000; // mỗi 60 giây / mỗi IP
const CHAT_FALLBACK_VI = 'Hiện hệ thống đang bận, vui lòng gọi hotline 0935 887 922 hoặc chat Zalo (zalo.me/0935887922) để được tư vấn ngay.';
const CHAT_FALLBACK_EN = 'Our system is a bit busy right now. Please call hotline +84 935 887 922 or chat via Zalo (zalo.me/0935887922) for immediate help.';
const CHAT_RATE_LIMIT_MSG_VI = 'Bạn đang gửi câu hỏi hơi nhanh, vui lòng chờ một chút rồi thử lại — hoặc gọi hotline 0935 887 922 để được hỗ trợ ngay.';
const CHAT_RATE_LIMIT_MSG_EN = 'You are sending messages a bit too fast — please wait a moment, or call hotline +84 935 887 922 for immediate help.';

// Map IP -> mảng timestamp câu hỏi gần đây. Worker isolate có thể bị hủy/khởi tạo lại bất cứ lúc
// nào (Cloudflare tự quản lý) nên đây CHỈ là rate limit "best-effort" trong phạm vi 1 isolate đang
// sống — đủ chống spam thông thường cho quy mô nhỏ hiện tại của dự án, không phải giới hạn cứng
// tuyệt đối across toàn bộ hạ tầng (nếu cần chính xác 100% phải lưu đếm ở Supabase/Durable Object).
const chatRateLimitMap = new Map();
function chatCheckRateLimit(ip) {
  const now = Date.now();
  const recent = (chatRateLimitMap.get(ip) || []).filter(t => now - t < CHAT_RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  chatRateLimitMap.set(ip, recent);
  if (chatRateLimitMap.size > 5000) { // dọn bớt map để không phình to mãi nếu isolate sống lâu
    for (const [k, v] of chatRateLimitMap) {
      if (!v.some(t => now - t < CHAT_RATE_LIMIT_WINDOW_MS)) chatRateLimitMap.delete(k);
    }
  }
  return recent.length <= CHAT_RATE_LIMIT_MAX;
}

function chatJson(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}

// Dò ngôn ngữ câu hỏi bằng dấu tiếng Việt — chỉ dùng để chọn NGÔN NGỮ CỦA TIN NHẮN FALLBACK khi AI
// lỗi (AI thật sự tự nhận diện ngôn ngữ khi trả lời bình thường, xem system prompt bên dưới).
function chatGuessLang(text, hint) {
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text || '')) return 'vi';
  if (hint === 'en') return 'en';
  return 'vi';
}

// Dò số điện thoại VN hợp lệ trong 1 đoạn tin nhắn tự do — cùng quy tắc với isValidPhone()/
// normalizePhone() trong index.html (0(3|5|7|8|9) + 8 số, chấp nhận cả dạng +84).
function chatExtractPhone(text) {
  const candidates = (text || '').match(/(\+84|0)[\s.\-]?\d[\s.\-\d]{7,11}\d/g) || [];
  for (const raw of candidates) {
    let p = raw.replace(/[\s.\-()]/g, '');
    if (p.startsWith('+84')) p = '0' + p.slice(3);
    if (/^0(3|5|7|8|9)\d{8}$/.test(p)) return p;
  }
  return null;
}
// Dò tên khách theo vài mẫu câu thường gặp (heuristic, không bắt buộc chính xác tuyệt đối) — nếu
// không dò được, dùng tên mặc định "Khách từ Chatbot" (không để trống cột name của leads).
function chatExtractName(text) {
  const t = (text || '');
  let m = t.match(/t[êe]n\s*(?:t[ôo]i|m[ìi]nh)?\s*(?:l[àa]|:)\s*([^\d,.;\n]{2,40})/i);
  if (m) return m[1].trim();
  m = t.match(/(?:my name is|i am|i'm)\s+([^\d,.;\n]{2,40})/i);
  if (m) return m[1].trim();
  return null;
}

// Tạo lead từ hội thoại nếu phát hiện SĐT hợp lệ VÀ phiên chat này CHƯA từng tạo lead — tránh tạo
// trùng lead nếu khách gõ lại số điện thoại ở tin nhắn sau. Nếu tạo lead mới, gán lead_id ngược lại
// cho MỌI dòng chat_logs cùng session_id (kể cả các dòng đã ghi trước đó) theo đúng yêu cầu spec.
async function chatDetectAndCaptureLead(env, sessionId, message) {
  const existing = await supa(env,
    'chat_logs?select=lead_id&session_id=eq.' + encodeURIComponent(sessionId) +
    '&lead_id=not.is.null&limit=1'
  ).catch(() => null);
  if (existing && existing.length) return existing[0].lead_id;

  const phone = chatExtractPhone(message);
  if (!phone) return null;
  const name = chatExtractName(message) || 'Khách từ Chatbot';
  const created = await supa(env, 'leads', {
    method: 'POST',
    body: JSON.stringify([{ name, phone, nguon: 'Từ Chatbot' }])
  });
  const leadId = created && created[0] && created[0].id;
  if (leadId) {
    await supa(env, 'chat_logs?session_id=eq.' + encodeURIComponent(sessionId), {
      method: 'PATCH', body: JSON.stringify({ lead_id: leadId }), prefer: 'return=minimal'
    }).catch(() => {});
  }
  return leadId || null;
}

// Đọc dữ liệu Visa THẬT để ground câu trả lời AI — bằng service role (danh_muc_nuoc KHÔNG mở anon
// đọc, xem CLAUDE.md/đặc tả mục 4.3). Bộ dữ liệu nhỏ (dưới 20 nước) nên lấy toàn bộ, không lọc theo
// từ khóa câu hỏi (lọc theo tên quốc gia không đáng tin do dấu/viết tắt tiếng Việt).
async function chatBuildGroundingText(env) {
  const [nuocRows, giaRows] = await Promise.all([
    supa(env, 'danh_muc_nuoc?select=ten,le_phi,thoi_gian_xet_duyet,checklist,ghi_chu&order=ten').catch(() => []),
    supa(env, 'dich_vu_gia?select=quoc_gia,gia&order=quoc_gia').catch(() => [])
  ]);
  const nuocText = (nuocRows || []).map(n => [
    '- ' + (n.ten || '?'),
    n.le_phi != null ? 'lệ phí lãnh sự khoảng ' + Number(n.le_phi).toLocaleString('vi-VN') + 'đ' : null,
    n.thoi_gian_xet_duyet ? 'thời gian xét duyệt: ' + n.thoi_gian_xet_duyet : null,
    n.checklist ? 'checklist hồ sơ: ' + n.checklist : null,
    n.ghi_chu ? 'ghi chú: ' + n.ghi_chu : null
  ].filter(Boolean).join('; ')).join('\n');
  const giaText = (giaRows || []).map(g =>
    '- ' + g.quoc_gia + ': ' + (g.gia != null && Number(g.gia) > 0 ? 'phí dịch vụ từ ' + Number(g.gia).toLocaleString('vi-VN') + 'đ' : 'liên hệ báo giá')
  ).join('\n');
  return 'DANH SÁCH QUỐC GIA (lệ phí/thời gian/checklist):\n' + (nuocText || '(chưa có dữ liệu)') +
    '\n\nBẢNG GIÁ DỊCH VỤ THEO QUỐC GIA:\n' + (giaText || '(chưa có dữ liệu)');
}

// replyLang được TÍNH SẴN từ trước (chatGuessLang, xem handleChat) rồi ÉP thẳng vào cuối prompt —
// đã test thật trên production thấy chỉ dặn chung chung "trả lời đúng ngôn ngữ câu hỏi" (đặt xen
// giữa nhiều quy tắc khác + khối dữ liệu dài) không đủ để model tuân theo ổn định (hỏi tiếng Anh
// nhưng model trả lời tiếng Việt) — đặt lại thành 1 CHỈ THỊ NGẮN, RÕ, RIÊNG BIỆT ở cuối cùng (ngay
// trước khi model sinh câu trả lời) đáng tin cậy hơn nhiều so với xen vào giữa danh sách quy tắc.
function chatBuildSystemPrompt(groundingText, replyLang) {
  const langDirective = replyLang === 'en'
    ? 'CHỈ THỊ NGÔN NGỮ (ưu tiên cao nhất, không được vi phạm): khách vừa gửi tin nhắn bằng TIẾNG ANH. Bạn PHẢI viết TOÀN BỘ câu trả lời bằng TIẾNG ANH, không được xen tiếng Việt.'
    : 'CHỈ THỊ NGÔN NGỮ (ưu tiên cao nhất, không được vi phạm): khách vừa gửi tin nhắn bằng TIẾNG VIỆT. Bạn PHẢI viết TOÀN BỘ câu trả lời bằng TIẾNG VIỆT.';
  return 'Bạn là trợ lý ảo của công ty dịch vụ Visa "Top Visa 5S" tại Đà Nẵng, Việt Nam (hotline 0935 887 922, Zalo zalo.me/0935887922).\n' +
    'QUY TẮC BẮT BUỘC:\n' +
    '1. CHỈ trả lời câu hỏi liên quan dịch vụ Visa của Top Visa 5S (loại visa, điều kiện, hồ sơ, quy trình, chi phí, thời gian xử lý, câu hỏi thường gặp). Câu hỏi ngoài phạm vi này thì lịch sự từ chối và mời liên hệ hotline.\n' +
    '2. CHỈ được dùng số liệu (lệ phí, thời gian xét duyệt, checklist, giá dịch vụ) có trong phần "DỮ LIỆU THẬT" bên dưới. TUYỆT ĐỐI KHÔNG tự bịa/suy đoán số liệu không có trong dữ liệu này.\n' +
    '3. Nếu không chắc chắn hoặc dữ liệu không đủ để trả lời chính xác, hãy nói rõ là chưa chắc chắn và mời khách gọi hotline hoặc chat Zalo để được tư vấn chính xác — không đoán.\n' +
    '4. Giọng văn thân thiện, ngắn gọn (tối đa khoảng 120 từ), dùng gạch đầu dòng nếu liệt kê nhiều ý.\n' +
    '5. Khi câu trả lời liên quan quyết định của khách (phí, hồ sơ, thời gian), luôn kết thúc bằng gợi ý liên hệ hotline/Zalo.\n\n' +
    'DỮ LIỆU THẬT (nguồn duy nhất được phép dùng khi trả lời về phí/thời gian/checklist):\n' + groundingText +
    '\n\n' + langDirective;
}

async function chatCallAI(env, systemPrompt, userMessage) {
  const result = await env.AI.run(CHAT_MODEL, {
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 400
  });
  const text = result && (result.response || result.result || '');
  return typeof text === 'string' ? text.trim() : '';
}

async function handleChat(request, env) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (!chatCheckRateLimit(ip)) {
      const lang = chatGuessLang('', 'vi');
      return chatJson({ reply: lang === 'en' ? CHAT_RATE_LIMIT_MSG_EN : CHAT_RATE_LIMIT_MSG_VI, lang, rate_limited: true });
    }

    let body;
    try { body = await request.json(); } catch (e) { return chatJson({ error: 'bad_request' }, 400); }
    const sessionId = (body && body.session_id || '').toString().slice(0, 100);
    const message = (body && body.message || '').toString().trim().slice(0, 1000);
    const langHint = (body && body.lang_hint === 'en') ? 'en' : 'vi';
    if (!sessionId || !message) return chatJson({ error: 'missing_fields' }, 400);

    if (!env.SUPABASE_SERVICE_ROLE_KEY) { // chưa cấu hình secret -> vẫn trả fallback, không lỗi trắng trang
      const lang = chatGuessLang(message, langHint);
      return chatJson({ reply: lang === 'en' ? CHAT_FALLBACK_EN : CHAT_FALLBACK_VI, lang });
    }

    // Tạo/tra lead TRƯỚC khi ghi chat_logs để có thể gán lead_id ngay từ dòng đầu tiên.
    let leadId = null;
    try { leadId = await chatDetectAndCaptureLead(env, sessionId, message); }
    catch (e) { console.error('chatDetectAndCaptureLead lỗi:', e); }

    await supa(env, 'chat_logs', {
      method: 'POST', prefer: 'return=minimal',
      body: JSON.stringify([{ session_id: sessionId, role: 'user', message, lang: langHint, lead_id: leadId }])
    }).catch(e => console.error('ghi chat_logs (user) lỗi:', e));

    // Tính ngôn ngữ trả lời TRƯỚC khi gọi AI — dùng chung cho cả chỉ thị ngôn ngữ trong prompt lẫn
    // tin nhắn fallback, đảm bảo 2 nơi luôn khớp nhau (không tính lại 2 lần dễ lệch).
    let reply;
    const replyLang = chatGuessLang(message, langHint);
    try {
      const grounding = await chatBuildGroundingText(env);
      const systemPrompt = chatBuildSystemPrompt(grounding, replyLang);
      const aiText = await chatCallAI(env, systemPrompt, message);
      if (!aiText) throw new Error('AI trả về rỗng');
      reply = aiText;
    } catch (e) {
      console.error('Gọi Workers AI lỗi, dùng fallback:', e);
      reply = replyLang === 'en' ? CHAT_FALLBACK_EN : CHAT_FALLBACK_VI;
    }

    await supa(env, 'chat_logs', {
      method: 'POST', prefer: 'return=minimal',
      body: JSON.stringify([{ session_id: sessionId, role: 'assistant', message: reply, lang: replyLang, lead_id: leadId }])
    }).catch(e => console.error('ghi chat_logs (assistant) lỗi:', e));

    return chatJson({ reply, lang: replyLang, lead_captured: !!leadId });
  } catch (e) {
    console.error('handleChat lỗi ngoài dự kiến:', e);
    return chatJson({ reply: CHAT_FALLBACK_VI, lang: 'vi' });
  }
}
