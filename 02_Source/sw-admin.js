// Service worker cho trang quan tri Top Visa 5S.
// 2 nhiem vu: (1) dang ky de trinh duyet cho phep "Cai dat ung dung" (PWA) — KHONG cache du lieu gi
// ca de tranh hien du lieu cu/sai (leads, ho so...); (2) nhan Web Push (thong bao day) va hien thi
// thong bao he thong ngay ca khi da tat han admin.html — xem CLAUDE.md muc 33.
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request)); });

/* ==== Cau hinh — PHAI khop dung SUPABASE_URL/ANON_KEY dang dan trong admin.html (anon key la khoa
   cong khai, an toan khi nhung o day) ==== */
const SUPABASE_URL = "https://vvnjxvcdnzttcdufjjgo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mp5Q5GRLV_ll8E4eNeivWw_aUv0q0xR";

/* ==== IndexedDB dung chung voi admin.html (cung ten db/store/key) de doc refresh token da luu —
   Service Worker KHONG doc duoc localStorage cua trang, chi doc duoc IndexedDB. ==== */
function idbOpen(){
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('tv5s-admin', 1);
    req.onupgradeneeded = () => req.result.createObjectStore('kv');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function idbGet(key){
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readonly');
    const req = tx.objectStore('kv').get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  }));
}
function idbSet(key, value){
  return idbOpen().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(value, key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  }));
}

/* ==== Nhan push (Cloudflare Worker gui - xem 02_Source/worker.js) — push KHONG kem noi dung san
   (silent push, chi de "danh thuc" trinh duyet), Service Worker tu lam moi access token bang
   refresh token da luu roi tu goi API lay thong bao chua doc moi nhat de hien thi cho dung noi
   dung that tai thoi diem nhan, thay vi nhung san noi dung luc gui (tranh phai tu ma hoa payload
   Web Push - RFC8291 - von rat de sai ma khong co thiet bi that de kiem chung). ==== */
self.addEventListener('push', event => {
  event.waitUntil(handlePush());
});

async function handlePush(){
  // Neu admin.html dang mo VA dang hien thi truoc mat (visibilityState 'visible') thi chuong trong
  // trang da tu cap nhat qua polling — khong can lam phien them bang thong bao he thong.
  try{
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if(list.some(c => c.visibilityState === 'visible')) return;
  }catch(e){ /* bo qua, cu tiep tuc hien thong bao cho chac */ }

  const fallback = () => self.registration.showNotification('Top Visa 5S Admin', {
    body: 'Có thông báo mới, mở app để xem chi tiết.',
    icon: 'assets/favicon.png', tag: 'tv5s-notif'
  });

  const rt = await idbGet('refresh_token').catch(() => null);
  if(!rt) return fallback();

  try{
    const tokRes = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
      body: JSON.stringify({ refresh_token: rt })
    });
    const tok = await tokRes.json();
    if(!tokRes.ok || !tok.access_token) return fallback();
    // Supabase co the xoay (rotate) refresh token moi lan dung — luu lai ngay de lan push sau van dung duoc.
    if(tok.refresh_token) await idbSet('refresh_token', tok.refresh_token).catch(() => {});

    // "Chua doc" tinh RIENG theo thiet bi nay (bang notification_reads, Phase 10) - KHONG con dung
    // cot is_read chung tren notifications nua (xem CLAUDE.md, sua cung luc voi admin.html), vi
    // may khac da doc khong duoc coi la may nay cung da doc. deviceId luu vao IndexedDB tu admin.html
    // (Service Worker khong doc duoc localStorage cua trang).
    const deviceId = await idbGet('device_id').catch(() => null);
    // Nếu thiết bị này CHƯA từng ghi device_id vào IndexedDB (vd trang admin.html chưa được mở lại
    // lần nào từ sau khi có Phase 10, nhưng Service Worker đã tự cập nhật bản mới ở tầng nền) —
    // KHÔNG có cách nào biết thiết bị này đã đọc gì hay chưa. Coi TẤT CẢ là "chưa đọc" (readIds
    // rỗng) sẽ khiến máy này bị lặp lại đúng vài thông báo cũ mỗi lần có push mới (thay vì chỉ
    // báo đúng cái mới) — dùng luôn thông báo dự phòng chung (giống lúc lỗi refresh token) an toàn
    // hơn là đoán sai trạng thái đã đọc.
    if(!deviceId) return fallback();
    const headers = { 'apikey': SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + tok.access_token };
    const [notifRes, readRes] = await Promise.all([
      fetch(SUPABASE_URL + '/rest/v1/notifications?select=id,noi_dung&order=created_at.desc&limit=30', { headers }),
      fetch(SUPABASE_URL + '/rest/v1/notification_reads?device_id=eq.' + encodeURIComponent(deviceId) + '&select=notification_id', { headers })
    ]);
    if(!notifRes.ok) return fallback();
    const allRows = await notifRes.json();
    const readIds = new Set(readRes.ok ? (await readRes.json()).map(r => r.notification_id) : []);
    const rows = allRows.filter(n => !readIds.has(n.id)).slice(0, 5);
    if(!rows.length) return; // khong con gi chua doc (rieng may nay) -> im lang, khong hien gi ca

    const body = rows.length > 1
      ? rows[0].noi_dung + ' (+' + (rows.length - 1) + ' thông báo khác)'
      : rows[0].noi_dung;
    return self.registration.showNotification('Top Visa 5S Admin', {
      body, icon: 'assets/favicon.png', tag: 'tv5s-notif'
    });
  }catch(e){
    return fallback();
  }
}

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for(const c of list){ if('focus' in c) return c.focus(); }
    return self.clients.openWindow('/admin.html');
  })());
});
