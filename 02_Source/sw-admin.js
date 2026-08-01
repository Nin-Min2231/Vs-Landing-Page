// Service worker toi gian cho trang quan tri Top Visa — chi dang ky de trinh duyet cho phep
// "Cai dat ung dung" (PWA), KHONG cache du lieu gi ca de tranh hien du lieu cu/sai (leads, ho so...).
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => self.clients.claim());
self.addEventListener('fetch', e => { e.respondWith(fetch(e.request)); });
