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
    // Redirect 301 vĩnh viễn workers.dev -> domain chính, giữ nguyên pathname+search.
    // KHÔNG có ngoại lệ nào (vd ?preview=1) — mọi ngoại lệ tạo ra 1 URL sống trên workers.dev với
    // nội dung đầy đủ, đúng cái redirect này sinh ra để tránh (rủi ro Google lập chỉ mục domain phụ
    // nếu link lọt ra ngoài). Cần test trên workers.dev thì dùng preview deployment
    // (`wrangler versions upload`), không mở lỗ trên production (xem CLAUDE.md, kế hoạch SEO T1).
    if (url.hostname.endsWith('.workers.dev')) {
      return Response.redirect('https://topvisa5s.com' + url.pathname + url.search, 301);
    }
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    }
    // Trang chủ: SSR đè giá thật từ dich_vu_gia vào HTML trước khi trả về (kế hoạch SEO T9) — để
    // Facebook/Zalo/Bing/lượt crawl đầu của Googlebot (không chạy JS) đọc đúng giá ngay từ đầu,
    // không còn phụ thuộc script phía client. Lỗi bất kỳ (Supabase down...) -> rơi về hành vi cũ
    // (serve file tĩnh nguyên bản, đã có giá đúng làm fallback tĩnh) chứ không làm hỏng trang.
    if (url.pathname === '/' && request.method === 'GET') {
      try {
        return await renderHomepageWithLivePrices(request, env);
      } catch (e) {
        return env.ASSETS.fetch(request);
      }
    }
    // Danh sách bài viết SSR (kế hoạch SEO T4) — Google/Facebook/Bing đọc được nội dung ngay,
    // không còn phụ thuộc JS phía client như trước (div#categorySections rỗng lúc tải trang).
    // Nhận cả HEAD (không chỉ GET) — 2 route này KHÔNG có file tĩnh tương ứng trong public/, nên nếu
    // rơi xuống env.ASSETS.fetch() (trang chủ "/" thì còn có index.html làm fallback, ở đây thì
    // không) sẽ ra 404 THẬT — phát hiện lúc tự kiểm bằng `curl -I` (HEAD) sau khi deploy lần đầu.
    if (url.pathname === '/blog' && (request.method === 'GET' || request.method === 'HEAD')) {
      try {
        return await renderBlogList(request, env);
      } catch (e) {
        console.error('renderBlogList lỗi:', e);
        return new Response('Không tải được danh sách bài viết, vui lòng thử lại sau.', {
          status: 500, headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
      }
    }
    // Chi tiết 1 bài viết SSR (kế hoạch SEO T4) — /blog/<slug>-<id>, tra theo id (số cuối URL).
    if (url.pathname.startsWith('/blog/') && (request.method === 'GET' || request.method === 'HEAD')) {
      try {
        return await renderBlogPost(request, env);
      } catch (e) {
        console.error('renderBlogPost lỗi:', e);
        return new Response('Không tải được bài viết, vui lòng thử lại sau.', {
          status: 500, headers: { 'Content-Type': 'text/plain;charset=utf-8' }
        });
      }
    }
    // Mọi request khác: thử phục vụ file tĩnh trước (hành vi cũ, GIỮ NGUYÊN 100% cho asset thật —
    // index.html/admin.html/robots.txt/assets/...). CHỈ khi Cloudflare không tìm thấy gì (404) —
    // path gõ sai, link cũ đã xoá, slug /blog hoặc /visa-<slug> tương lai không tồn tại — mới tự
    // dựng trang 404 đầy đủ navbar/footer thay vì trang trắng mặc định (kế hoạch SEO T21).
    const assetRes = await env.ASSETS.fetch(request);
    if (assetRes.status === 404 && (request.method === 'GET' || request.method === 'HEAD')) {
      try {
        return await render404Page(request, env);
      } catch (e) {
        console.error('render404Page lỗi:', e);
        return assetRes; // lỗi khi tự dựng trang -> rơi về 404 mặc định của Cloudflare, không vỡ trang
      }
    }
    return assetRes;
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

/* ==================== SSR GIÁ DỊCH VỤ TRANG CHỦ (kế hoạch SEO T9, 2026-09) ====================
   Đọc dich_vu_gia qua supa() có sẵn (chạy bằng SUPABASE_SERVICE_ROLE_KEY, đã cấu hình sẵn trên
   Worker này — KHÔNG cần thêm biến môi trường mới, tránh lặp lại bài học "quên thêm 1 biến nên
   job im lặng không chạy gì" ở CLAUDE.md mục 34.B) rồi .replace() thẳng vào HTML tĩnh, CHỈ với
   nước có gia hợp lệ (>0) — nước gia=null (hiện tại là "Khác") giữ nguyên "Liên hệ báo giá" viết
   sẵn trong HTML, không đụng tới. Script phía client (mục "GIÁ DỊCH VỤ" trong index.html) vẫn chạy
   sau đó như cũ (đọc lại đúng y kết quả này, không đổi gì cho người dùng có JS) — 2 lớp này độc
   lập nhau, chỉ khác đối tượng phục vụ: SSR cho khách/bot KHÔNG chạy JS, client-side JS cho trình
   duyệt thường (phòng khi SSR lỗi/giá đổi ngay sau khi trang đã tải). */
function escapeRegExpLiteral(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
async function renderHomepageWithLivePrices(request, env) {
  const [assetRes, rows] = await Promise.all([
    env.ASSETS.fetch(request),
    supa(env, 'dich_vu_gia?select=quoc_gia,gia')
  ]);
  if (!assetRes.ok) return assetRes;
  let html = await assetRes.text();
  for (const row of (rows || [])) {
    if (row.gia == null || Number(row.gia) <= 0) continue; // giữ "Liên hệ báo giá" tĩnh
    const priceText = 'Tổng từ ' + Number(row.gia).toLocaleString('vi-VN') + 'đ';
    const re = new RegExp('(data-country="' + escapeRegExpLiteral(row.quoc_gia) + '">)[^<]*(</div>)');
    html = html.replace(re, '$1' + priceText + '$2');
  }
  const headers = new Headers();
  headers.set('Content-Type', assetRes.headers.get('Content-Type') || 'text/html;charset=UTF-8');
  headers.set('Cache-Control', 'public, max-age=300');
  return new Response(html, { status: assetRes.status, headers });
}

/* ==================== BLOG SSR — /blog và /blog/<slug>-<id> (kế hoạch SEO T4) ====================
   Trước T4: div#categorySections rỗng lúc tải trang (bài viết nạp bằng JS), chi tiết mở bằng
   openPostDetail(i) không đổi URL -> Google không có gì để lập chỉ mục. 2 route dưới đây dựng HTML
   ĐẦY ĐỦ nội dung ngay trong response đầu tiên, có <head> riêng (title/description/self-canonical/
   og:*) + JSON-LD Article ở trang chi tiết.

   getSiteChrome() trích CSS design system + navbar + footer TRỰC TIẾP từ chính index.html đang chạy
   (qua env.ASSETS.fetch) — KHÔNG copy cứng 1 bản riêng trong worker.js, để /blog* luôn tự động khớp
   100% với trang chủ mỗi khi sau này ai đó sửa design system/navbar/footer, không phải nhớ sửa 2
   nơi (đúng bài học "2 bản sao dễ lệch nhau" đã gặp nhiều lần — giá dịch vụ mục 31.D, FAQ/JSON-LD
   mục 12). Asset tương đối ("assets/logo.svg") trong navbar/footer trích ra được đổi thành tuyệt
   đối ("/assets/logo.svg") vì /blog* không đứng ở "/" nên đường dẫn tương đối sẽ trỏ sai chỗ; anchor
   "#dich-vu" đổi thành "/#dich-vu" để bấm vào luôn quay lại đúng section ở trang chủ (các section đó
   không tồn tại trên chính trang /blog*). */
function escHtml(s) {
  return (s ?? '').toString().replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
async function getSiteChrome(env, request) {
  const homeRes = await env.ASSETS.fetch(new Request(new URL('/', request.url)));
  if (!homeRes.ok) throw new Error('Không tải được index.html để trích design system (HTTP ' + homeRes.status + ')');
  const html = await homeRes.text();
  const fixPaths = s => s.replace(/(src|srcset)="assets\//g, '$1="/assets/').replace(/href="#/g, 'href="/#');
  const css = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  const navbar = fixPaths((html.match(/<nav class="navbar">[\s\S]*?<\/nav>/) || [])[0] || '');
  const footer = fixPaths((html.match(/<footer id="footer">[\s\S]*?<\/footer>/) || [])[0] || '');
  return { css, navbar, footer };
}
// Head chung cho mọi trang /blog* — dùng lại đúng 6 dòng icon/font đã có ở index.html, sửa path
// "assets/..." tương đối thành "/assets/..." tuyệt đối vì lý do đã giải thích ở trên. 2 rule CSS phụ
// thêm cuối cùng (h1.section-title, .article-title) CHỈ nới rộng selector có sẵn sang thêm 1 thẻ H1
// (để mỗi trang có ĐÚNG 1 H1 ngữ nghĩa) — dùng lại y nguyên giá trị số/biến màu đã có, không bịa
// thêm màu/khoảng cách mới.
function blogHeadCommon(title, description, canonical, ogImage) {
  return `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#1B6EF3">
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(description)}">
<link rel="canonical" href="${escHtml(canonical)}">
<link rel="icon" type="image/svg+xml" href="/assets/logo.svg">
<link rel="icon" type="image/png" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-180.png">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Top Visa 5S">
<meta property="og:locale" content="vi_VN">
<meta property="og:url" content="${escHtml(canonical)}">
<meta property="og:title" content="${escHtml(title)}">
<meta property="og:description" content="${escHtml(description)}">
<meta property="og:image" content="${escHtml(ogImage)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap" rel="stylesheet">`;
}
const BLOG_EXTRA_CSS = `
h1.section-title{font-size:32px;font-weight:700;text-align:center;margin-bottom:var(--sp-1)}
.article-title{font-size:28px;font-weight:700;line-height:1.3;margin:var(--sp-2) 0 6px}
.article-meta{font-size:13px;color:var(--color-text-muted);margin-bottom:var(--sp-3)}
.article-body{font-size:16px;line-height:1.8;color:var(--color-text);white-space:pre-wrap}
.article-cover{width:100%;max-height:420px;object-fit:cover;border-radius:var(--radius-lg);margin-bottom:var(--sp-3)}
`;

const DEFAULT_OG_IMAGE = 'https://topvisa5s.com/assets/og-image.png';

async function renderBlogList(request, env) {
  const url = new URL(request.url);
  const canonical = url.origin + url.pathname; // T1: origin+pathname, KHÔNG kèm query
  const [chrome, posts] = await Promise.all([
    getSiteChrome(env, request),
    supa(env, 'posts?select=id,title,slug,image_url,created_at,categories(name)&published=eq.true&order=created_at.desc')
  ]);
  const title = 'Blog / Tin tức Visa – Top Visa 5S';
  const description = 'Cập nhật tin tức, kinh nghiệm và hướng dẫn thủ tục xin visa Nhật Bản, Hàn Quốc, Đài Loan, Trung Quốc, Schengen, Mỹ, Úc từ Top Visa 5S.';

  const articlesHtml = (posts || []).map(p => {
    const href = '/blog/' + (p.slug || 'bai-viet') + '-' + p.id;
    const dateStr = new Date(p.created_at).toLocaleDateString('vi-VN');
    const thumb = p.image_url
      ? `<img class="thumb" src="${escHtml(p.image_url)}" alt="${escHtml(p.title)}" loading="lazy" width="400" height="174">`
      : `<div class="thumb-placeholder">📰</div>`;
    return `<article><a class="card-post" href="${href}">
      ${thumb}
      <div class="body">
        <div class="cat">${escHtml(p.categories?.name || 'Tin tức')}</div>
        <h3>${escHtml(p.title)}</h3>
        <div class="meta"><span>${dateStr}</span><span class="post-readmore">Đọc tiếp →</span></div>
      </div>
    </a></article>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
${blogHeadCommon(title, description, canonical, DEFAULT_OG_IMAGE)}
<style>${chrome.css}${BLOG_EXTRA_CSS}</style>
</head>
<body>
<a href="#noi-dung" class="skip-link">Bỏ qua tới nội dung</a>
${chrome.navbar}
<main id="noi-dung">
<section id="blog-list">
  <div class="container">
    <h1 class="section-title">Blog / Tin tức Visa</h1>
    <p class="section-sub">Cập nhật thông tin, kinh nghiệm xin visa mới nhất từ Top Visa 5S</p>
    <div class="grid-posts">${articlesHtml || '<p style="text-align:center;color:var(--color-text-muted)">Chưa có bài viết nào.</p>'}</div>
  </div>
</section>
</main>
${chrome.footer}
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=300' }
  });
}

// Bỏ hết thẻ HTML rồi lấy đúng N ký tự đầu — dùng cho meta description (155 ký tự, theo yêu cầu
// kế hoạch SEO T4). content trong DB hiện tại là text thường (không chứa HTML thật), nhưng vẫn lọc
// phòng trường hợp ai đó dán nhầm đoạn có thẻ <...> vào — không để lọt vào description hiển thị
// trên kết quả tìm kiếm.
function stripHtmlAndTruncate(text, maxLen) {
  const plain = (text || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > maxLen ? plain.slice(0, maxLen).trim() + '…' : plain;
}

async function renderBlogPost(request, env) {
  const url = new URL(request.url);
  const seg = url.pathname.slice('/blog/'.length).replace(/\/+$/, ''); // phần sau "/blog/", bỏ "/" thừa cuối
  let urlSlug, id;
  const mSlugId = seg.match(/^(.+)-(\d+)$/); // "<slug>-<id>" — tách đúng <id> là số cuối cùng
  const mIdOnly = seg.match(/^(\d+)$/);      // fallback: chỉ gõ "/blog/<id>", không có slug
  if (mSlugId) { urlSlug = mSlugId[1]; id = mSlugId[2]; }
  else if (mIdOnly) { urlSlug = ''; id = mIdOnly[1]; }
  else return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });

  const rows = await supa(env,
    'posts?select=id,title,slug,image_url,content,created_at,updated_at,categories(name)' +
    '&id=eq.' + encodeURIComponent(id) + '&published=eq.true');
  const p = rows && rows[0];
  if (!p) return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain;charset=utf-8' } }); // không tồn tại/chưa publish -> 404 thật, KHÔNG redirect về trang chủ (tránh soft-404)

  // Slug trong URL sai (bài đổi tiêu đề, hoặc ai gõ tay/để trống) -> 301 sang URL đúng, đổi tiêu đề
  // bài không làm hỏng link cũ vì việc tra bài luôn dựa vào id, chưa từng dựa vào slug.
  const realSlug = p.slug || 'bai-viet';
  if (urlSlug !== realSlug) {
    return Response.redirect(url.origin + '/blog/' + realSlug + '-' + p.id, 301);
  }

  const canonical = url.origin + url.pathname; // T1: origin+pathname, KHÔNG kèm query
  const description = stripHtmlAndTruncate(p.content, 155);
  const ogImage = p.image_url || DEFAULT_OG_IMAGE;
  const dateStr = new Date(p.created_at).toLocaleDateString('vi-VN');
  const isoPublished = new Date(p.created_at).toISOString();
  const isoModified = new Date(p.updated_at || p.created_at).toISOString();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    datePublished: isoPublished,
    dateModified: isoModified,
    author: { '@type': 'Organization', name: 'Top Visa 5S' },
    image: ogImage
  };

  const chrome = await getSiteChrome(env, request);
  const cover = p.image_url
    ? `<img class="article-cover" src="${escHtml(p.image_url)}" alt="${escHtml(p.title)}" width="800" height="420">`
    : '';

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
${blogHeadCommon(p.title, description, canonical, ogImage)}
<style>${chrome.css}${BLOG_EXTRA_CSS}</style>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a href="#noi-dung" class="skip-link">Bỏ qua tới nội dung</a>
${chrome.navbar}
<main id="noi-dung">
<section id="blog-post">
  <div class="container" style="max-width:760px">
    <p><a href="/blog">← Tất cả bài viết</a></p>
    ${cover}
    <div class="cat">${escHtml(p.categories?.name || 'Tin tức')}</div>
    <h1 class="article-title">${escHtml(p.title)}</h1>
    <div class="article-meta">${dateStr}</div>
    <div class="article-body">${escHtml(p.content || '')}</div>
  </div>
</section>
</main>
${chrome.footer}
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'public,max-age=300' }
  });
}

/* ==================== TRANG 404 ĐẦY ĐỦ — mọi path không khớp route nào (kế hoạch SEO T21) ====
   Trước T21: path sai/đã xoá rơi xuống 404 mặc định của Cloudflare (trang trắng, không navbar) ->
   khách vào là thoát luôn. Sắp có 2 nhóm route động (/blog/<slug>-<id>, /visa-<slug>) sẽ sinh thêm
   nhiều đường dẫn 404 tiềm năng (slug gõ sai, bài bị unpublish, link cũ chia sẻ trên Facebook, nước
   chưa publish) nên cần trang 404 tử tế: navbar, footer, câu xin lỗi, link về trang chủ + /blog +
   trang quốc gia ĐANG PUBLISH + hotline — dùng lại đúng getSiteChrome() đã có ở khối Blog SSR phía
   trên (không copy riêng 1 bản navbar/footer khác). noindex để Google không lập chỉ mục nhầm trang
   lỗi. CHƯA làm 410 Gone cho bài đã unpublish — cần thêm cột theo dõi "đã từng publish", phức tạp
   hơn giá trị ở giai đoạn này; khi nào thật sự gỡ bài thì làm sau.

   Link trang quốc gia lấy ĐỘNG từ bảng noi_dung_quoc_gia (T13/T14, CHƯA làm ở thời điểm viết T21)
   -> query dưới đây sẽ ném lỗi "relation does not exist" và bị nuốt về mảng rỗng (catch), nên trang
   404 hiện tại chỉ còn link trang chủ + /blog + hotline. Khi T13/T14 xong và có nước published, trang
   404 TỰ ĐỘNG hiện thêm link ngay, không cần sửa lại file này lần nữa. */
async function getPublishedCountryLinks(env) {
  try {
    const rows = await supa(env, 'noi_dung_quoc_gia?select=slug,ten_nuoc&published=eq.true&order=thu_tu&limit=4');
    return rows || [];
  } catch (e) {
    return []; // bảng chưa tồn tại (chưa chạy migration T13) hoặc lỗi khác -> không hiện link, không throw
  }
}

const NOTFOUND_EXTRA_CSS = `
.notfound-box{max-width:640px;text-align:center;padding:var(--sp-10) var(--sp-3);margin:0 auto}
.notfound-code{font-size:80px;font-weight:800;color:var(--color-primary);line-height:1;margin-bottom:var(--sp-2)}
.notfound-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--sp-2);margin:var(--sp-4) 0}
.notfound-hotline{color:var(--color-text-muted);font-size:15px}
.notfound-hotline a{color:var(--color-primary);font-weight:700;text-decoration:none}
`;

async function render404Page(request, env) {
  const [chrome, countries] = await Promise.all([
    getSiteChrome(env, request),
    getPublishedCountryLinks(env)
  ]);

  // c.slug đã LÀ toàn bộ path cuối (vd "visa-nhat-ban", xem thiết kế cột slug ở T13/T14) — không
  // ghép thêm tiền tố "visa-" nữa, chỉ nối "/" + slug.
  const countryLinksHtml = countries.map(c =>
    `<a class="btn btn-outline" href="/${escHtml(c.slug)}">Visa ${escHtml(c.ten_nuoc)}</a>`
  ).join('');

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#1B6EF3">
<title>Không tìm thấy trang – Top Visa 5S</title>
<meta name="robots" content="noindex">
<link rel="icon" type="image/svg+xml" href="/assets/logo.svg">
<link rel="icon" type="image/png" href="/assets/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;700&display=swap" rel="stylesheet">
<style>${chrome.css}${BLOG_EXTRA_CSS}${NOTFOUND_EXTRA_CSS}</style>
</head>
<body>
<a href="#noi-dung" class="skip-link">Bỏ qua tới nội dung</a>
${chrome.navbar}
<main id="noi-dung">
<section id="not-found">
  <div class="container notfound-box">
    <div class="notfound-code">404</div>
    <h1 class="section-title">Không tìm thấy trang bạn cần</h1>
    <p class="section-sub">Đường dẫn này không tồn tại hoặc đã được thay đổi. Xin lỗi vì sự bất tiện này — bạn có thể quay lại trang chủ hoặc xem các mục dưới đây.</p>
    <div class="notfound-actions">
      <a class="btn btn-primary" href="/">🏠 Về trang chủ</a>
      <a class="btn btn-outline" href="/blog">📰 Xem Blog</a>
      ${countryLinksHtml}
    </div>
    <p class="notfound-hotline">Cần hỗ trợ ngay? Gọi hotline <a href="tel:0935887922"><b>0935 887 922</b></a></p>
  </div>
</section>
</main>
${chrome.footer}
</body>
</html>`;

  return new Response(html, {
    status: 404,
    headers: { 'Content-Type': 'text/html;charset=utf-8', 'Cache-Control': 'no-store' }
  });
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
// Câu dự phòng khi env.AI.run lỗi/hết quota (T6, kế hoạch SEO) — cố tình mời "để lại số điện
// thoại" (khớp đúng nút có sẵn "Để lại số điện thoại tư vấn" trong khung chat, xem index.html) thay
// vì mời Zalo như bản trước — không đổi giao diện chatbox, chỉ đổi nội dung câu dự phòng.
const CHAT_FALLBACK_VI = 'Hệ thống đang bận, bạn vui lòng gọi 0935 887 922 hoặc để lại số điện thoại, chuyên viên sẽ gọi lại ngay.';
const CHAT_FALLBACK_EN = 'Our system is currently busy. Please call 0935 887 922, or leave your phone number and our specialist will call you back right away.';
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

// ⚠️ Lịch sử debug ngôn ngữ trả lời (FR-CB-05) — đã thử 2 cách qua system prompt và CẢ 2 ĐỀU
// KHÔNG đủ tin cậy, kiểm chứng bằng gọi thật /api/chat nhiều lần trên production, không phải suy
// đoán: (1) prompt tiếng Việt + 1 dòng chỉ thị "trả lời tiếng Anh" ở cuối — model vẫn trả lời tiếng
// Việt hầu hết; (2) viết hẳn 2 bản prompt riêng (toàn bộ quy tắc bằng tiếng Anh khi cần trả lời
// tiếng Anh) — VẪN có lúc trả lời tiếng Việt. Model @cf/meta/llama-3.1-8b-instruct-fast có vẻ bị
// "kéo" theo ngôn ngữ của phần "DỮ LIỆU THẬT" (luôn là tiếng Việt, vì đó là dữ liệu gốc trong
// Supabase) mạnh hơn hẳn chỉ dẫn ngôn ngữ, bất kể đặt chỉ dẫn ở đâu/viết bằng ngôn ngữ nào.
// ĐÃ ĐỔI SANG CÁCH ĐÁNG TIN CẬY HƠN NHIỀU (xem handleChat): LUÔN sinh câu trả lời gốc bằng tiếng
// Việt (chiều này luôn đúng, vì mọi thứ trong prompt đã là tiếng Việt) rồi DỊCH SANG TIẾNG ANH bằng
// 1 lượt gọi AI riêng (chatTranslateToEnglish()) nếu replyLang==='en' — "dịch đoạn văn cho trước
// sang tiếng Anh" là tác vụ đơn giản, tách biệt, mà model làm đúng gần như tuyệt đối, không còn bị
// ngữ cảnh tiếng Việt của phần dữ liệu "kéo" nữa. Đánh đổi: câu hỏi tiếng Anh tốn thêm 1 lượt gọi
// AI (thêm ~1-2s độ trễ) — chấp nhận được trong ngưỡng NFR (1-3s, có trạng thái loading).
function chatBuildSystemPrompt(groundingText) {
  return 'Bạn là trợ lý ảo của công ty dịch vụ Visa "Top Visa 5S" tại Đà Nẵng, Việt Nam (hotline 0935 887 922, Zalo zalo.me/0935887922).\n' +
    'QUY TẮC BẮT BUỘC:\n' +
    '1. CHỈ trả lời câu hỏi liên quan dịch vụ Visa của Top Visa 5S (loại visa, điều kiện, hồ sơ, quy trình, chi phí, thời gian xử lý, câu hỏi thường gặp). Câu hỏi ngoài phạm vi này thì lịch sự từ chối và mời liên hệ hotline.\n' +
    '2. CHỈ được dùng số liệu (lệ phí, thời gian xét duyệt, checklist, giá dịch vụ) có trong phần "DỮ LIỆU THẬT" bên dưới. TUYỆT ĐỐI KHÔNG tự bịa/suy đoán số liệu không có trong dữ liệu này.\n' +
    '3. Nếu không chắc chắn hoặc dữ liệu không đủ để trả lời chính xác, hãy nói rõ là chưa chắc chắn và mời khách gọi hotline hoặc chat Zalo để được tư vấn chính xác — không đoán.\n' +
    '4. Giọng văn thân thiện, ngắn gọn (tối đa khoảng 120 từ), dùng gạch đầu dòng nếu liệt kê nhiều ý.\n' +
    '5. Khi câu trả lời liên quan quyết định của khách (phí, hồ sơ, thời gian), luôn kết thúc bằng gợi ý liên hệ hotline/Zalo.\n' +
    '6. Luôn viết câu trả lời bằng TIẾNG VIỆT (kể cả nếu khách hỏi bằng ngôn ngữ khác — hệ thống sẽ tự dịch lại nếu cần).\n\n' +
    'DỮ LIỆU THẬT (nguồn duy nhất được phép dùng khi trả lời về phí/thời gian/checklist):\n' + groundingText;
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

// Dịch 1 đoạn văn tiếng Việt sang tiếng Anh — tác vụ ĐƠN GIẢN/TÁCH BIỆT nên đáng tin cậy hơn hẳn so
// với việc bắt model vừa trả lời vừa tự nhớ đổi ngôn ngữ đầu ra (xem comment ở chatBuildSystemPrompt).
async function chatTranslateToEnglish(env, viText) {
  const result = await env.AI.run(CHAT_MODEL, {
    messages: [
      { role: 'system', content: 'You are a professional Vietnamese-to-English translator for a visa service company chatbot. Translate the given Vietnamese text into natural, friendly English. Keep all numbers, prices and phone numbers unchanged, and keep the company name "Top Visa 5S" unchanged. Output ONLY the English translation — no explanation, no quotes, no Vietnamese text.' },
      { role: 'user', content: viText }
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

    // Tính ngôn ngữ trả lời TRƯỚC khi gọi AI — dùng cho cả bước dịch lẫn tin nhắn fallback.
    let reply;
    const replyLang = chatGuessLang(message, langHint);
    try {
      const grounding = await chatBuildGroundingText(env);
      const systemPrompt = chatBuildSystemPrompt(grounding); // LUÔN sinh bản gốc tiếng Việt, xem comment ở chatBuildSystemPrompt
      let aiText = await chatCallAI(env, systemPrompt, message);
      if (!aiText) throw new Error('AI trả về rỗng');
      if (replyLang === 'en') {
        const translated = await chatTranslateToEnglish(env, aiText).catch(e => { console.error('Dịch sang tiếng Anh lỗi:', e); return ''; });
        if (translated) aiText = translated;
        // dịch lỗi/rỗng -> vẫn dùng bản tiếng Việt còn hơn báo fallback (khách vẫn đọc được thông
        // tin thật, chỉ là sai ngôn ngữ mong muốn — nhẹ hơn nhiều so với mất hẳn thông tin)
      }
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
