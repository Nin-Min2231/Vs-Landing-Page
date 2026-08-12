// Cloudflare Worker — việc nền cho trang quản trị Top Visa 5S (xem CLAUDE.md mục 33).
//
// 1) fetch(): GIỮ NGUYÊN hành vi phục vụ file tĩnh cũ (index.html/admin.html/assets/...) —
//    không đổi gì với khách truy cập landing page hay admin đăng nhập bình thường.
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
    return env.ASSETS.fetch(request);
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
   "Hôm nay" tính theo UTC (new Date().toISOString()) để khớp đúng cách admin.html đang tính
   "hôm nay" ở Dashboard/Hồ sơ (todayIso/todayStr) — tránh 2 nơi lệch ngày nhau. Biết trước hạn
   chế: quanh 00:00-07:00 giờ Việt Nam, mốc UTC vẫn là "ngày hôm qua" nên có thể trễ vài giờ vào
   sáng sớm — không ảnh hưởng thực tế vì đây không phải giờ làm việc. */
async function generateNewNotifications(env) {
  const today = new Date().toISOString().slice(0, 10);
  const candidates = [];

  // Mỗi loại bọc try/catch RIÊNG — 1 loại lỗi (vd sai cú pháp filter, đổi schema...) không được
  // phép làm im lặng luôn 2 loại còn lại (bài học thật từ lúc set up lần đầu, xem CLAUDE.md mục 33).
  try {
    // 'tra_kq': hồ sơ có ngay_tra_kq đúng hôm nay, còn "Đã nộp"/"Đang xử lý" — khớp đúng điều kiện
    // khối "Hồ sơ trả kết quả tuần này" ở Dashboard (CLAUDE.md mục 31.A).
    const hoSoRows = await supa(env,
      'ho_so?select=id,ten_khach,ngay_tra_kq,danh_muc_nuoc(ten)' +
      '&ngay_tra_kq=eq.' + today +
      '&trang_thai=in.' + encodeURIComponent('("Đã nộp","Đang xử lý")'));
    for (const h of hoSoRows || []) {
      candidates.push({
        loai: 'tra_kq', ref_table: 'ho_so', ref_id: h.id, ref_parent_id: null, ref_ngay: h.ngay_tra_kq,
        noi_dung: (h.ten_khach || 'Khách hàng') + '_ Visa ' + (h.danh_muc_nuoc?.ten || 'chưa rõ')
      });
    }
  } catch (e) { console.error('generateNewNotifications tra_kq lỗi:', e); }

  try {
    // 'nhac_tuvan': lead có ngay_nhac_lai đúng hôm nay — không lọc trạng thái, khớp view có sẵn
    // v_tu_van_can_nhac_lai (05_Database/02_supabase_setup_phase2.sql).
    const nhacLaiRows = await supa(env,
      'leads?select=id,name,country,ngay_nhac_lai&ngay_nhac_lai=eq.' + today);
    for (const l of nhacLaiRows || []) {
      candidates.push({
        loai: 'nhac_tuvan', ref_table: 'leads', ref_id: l.id, ref_parent_id: null, ref_ngay: l.ngay_nhac_lai,
        noi_dung: (l.name || 'Khách hàng') + '_ Visa ' + (l.country || 'chưa rõ')
      });
    }
  } catch (e) { console.error('generateNewNotifications nhac_tuvan lỗi:', e); }

  try {
    // 'dang_ky_moi': khách tự đăng ký từ form công khai index.html (nguon='Từ Web'). Giới hạn 200
    // dòng mới nhất — đủ rộng để không bỏ sót nếu Worker lỡ dừng vài ngày, vẫn nhẹ cho DB; dòng đã
    // có thông báo rồi tự bị bỏ qua nhờ ràng buộc unique khi upsert bên dưới.
    const moiRows = await supa(env,
      'leads?select=id,name,country,created_at&nguon=eq.' + encodeURIComponent('Từ Web') +
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
    // 'xlps': xử lý phát sinh (trong dialog Hồ sơ) có han_chot đúng hôm nay, còn "Đang xử lý" —
    // khớp đúng điều kiện view v_xu_ly_phat_sinh_7_ngay (chỉ tính khi chưa Hủy/Tạm dừng/Hoàn
    // thành). ref_id PHẢI là id của chính dòng xử lý phát sinh (không phải ho_so_id) để 2 dòng
    // xử lý phát sinh khác nhau cùng hạn chốt trên 1 hồ sơ vẫn tạo được 2 thông báo riêng —
    // ref_parent_id lưu ho_so_id để admin.html biết mở đúng Hồ sơ nào lúc bấm vào thông báo.
    const xlpsRows = await supa(env,
      'ho_so_xu_ly_phat_sinh?select=id,ho_so_id,noi_dung,han_chot,ho_so(ten_khach,danh_muc_nuoc(ten))' +
      '&han_chot=eq.' + today +
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
