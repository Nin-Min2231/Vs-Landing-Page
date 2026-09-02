// Tool backup toan bo du lieu Supabase ve may (chay tay khi can, xem README.md trong thu muc nay).
// KHONG dung SDK/npm package nao - chi goi thang REST API bang service_role key, dung triet ly
// don gian cua du an (CLAUDE.md muc 3).
//
// Cach chay: double-click "Chay_Backup.bat", hoac go "node backup-supabase.mjs" trong terminal
// dung thu muc nay.

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'backup-config.json');

// Danh sach toan bo 21 bang hien co trong database (khop dung voi cac file 05_Database/*.sql) —
// ⚠️ khi them bang moi trong 1 migration moi, BAT BUOC them ten bang do vao day (xem
// 05_Database/README.md muc "Quy tac khi them migration moi" - da ghi ro yeu cau nay tu 2026-08).
// Neu bang moi KHONG co cot "id" don (vd dung khoa chinh ghep nhieu cot) thi phai khai bao them
// vao ORDER_BY o duoi, khong thi tool se loi/phan trang sai (xem vi du notification_reads).
const TABLES = [
  'leads', 'categories', 'posts',
  'danh_muc_nuoc', 'danh_muc_muc_dich', 'danh_muc_truong_nhom', 'danh_muc_doi_tac',
  'doi_tac', 'doi_tac_phi',
  'ho_so', 'ho_so_thanh_vien', 'ho_so_xu_ly_phat_sinh',
  'khoan_chi', 'khach_hang', 'dich_vu_gia',
  'notifications', 'push_subscriptions', 'notification_reads',
  'chat_logs', // Phase 11 (Chat Box, Release 1) - khoa chinh don "id", khong can them vao ORDER_BY
  'danh_gia_khach_hang', // Phase 12 (Feedback khach hang) - khoa chinh don "id", khong can ORDER_BY
  'noi_dung_quoc_gia' // Phase 14 (T13, noi dung 7 trang quoc gia) - khoa chinh don "id", khong can ORDER_BY
];

// Cot dung de ORDER BY luc phan trang (bat buoc phai co 1 cot/tap cot sap xep ON DINH, khong thi
// phan trang bang Range header co the bi lap/thieu dong giua cac trang do Postgres khong dam bao
// thu tu neu khong co ORDER BY). Mac dinh dung "id" cho moi bang - chi khai bao rieng o day cho
// bang nao KHONG co cot "id" don (dung khoa chinh ghep nhieu cot).
const ORDER_BY = {
  notification_reads: 'notification_id.asc,device_id.asc'
};

function loadConfig() {
  let raw;
  try {
    raw = readFileSync(CONFIG_PATH, 'utf8');
  } catch (e) {
    console.error('\n❌ Không tìm thấy file "backup-config.json" trong thư mục này.');
    console.error('   Copy file "backup-config.example.json" thành "backup-config.json",');
    console.error('   mở bằng Notepad rồi dán khóa service_role thật vào (xem README.md).\n');
    process.exit(1);
  }
  const cfg = JSON.parse(raw);
  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\n❌ File "backup-config.json" thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY.\n');
    process.exit(1);
  }
  return cfg;
}

// Lay TOAN BO dong cua 1 bang, tu phan trang bang header Range (moi lan lay 1000 dong) de khong
// bi cat bot du lieu neu bang co qua 1000 dong (gioi han mac dinh cua PostgREST/Supabase).
async function fetchAllRows(baseUrl, serviceRoleKey, table) {
  const rows = [];
  const pageSize = 1000;
  const orderBy = ORDER_BY[table] || 'id.asc';
  let from = 0;
  while (true) {
    const res = await fetch(`${baseUrl}/rest/v1/${table}?select=*&order=${orderBy}`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Range: `${from}-${from + pageSize - 1}`,
        Prefer: 'count=exact'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    const chunk = await res.json();
    rows.push(...chunk);
    const contentRange = res.headers.get('content-range'); // vd "0-999/1532"
    const total = contentRange && contentRange.includes('/') ? Number(contentRange.split('/')[1]) : null;
    if (chunk.length < pageSize || (total !== null && rows.length >= total)) break;
    from += pageSize;
  }
  return rows;
}

// Doi 1 mang object phang (khong long nhau, dung voi select=*) thanh noi dung file CSV.
function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = v => {
    if (v === null || v === undefined) return '';
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const lines = [headers.map(escape).join(',')];
  for (const row of rows) lines.push(headers.map(h => escape(row[h])).join(','));
  return '﻿' + lines.join('\r\n'); // BOM UTF-8 de Excel mo dung tieng Viet
}

async function main() {
  const cfg = loadConfig();
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0, 16); // vd 2026-08-12-1530
  const outDir = path.join(__dirname, 'backups', stamp);
  mkdirSync(outDir, { recursive: true });

  console.log(`\n📦 Bắt đầu backup vào thư mục: ${outDir}\n`);
  let totalRows = 0, failed = [];

  for (const table of TABLES) {
    try {
      const rows = await fetchAllRows(cfg.SUPABASE_URL, cfg.SUPABASE_SERVICE_ROLE_KEY, table);
      writeFileSync(path.join(outDir, `${table}.json`), JSON.stringify(rows, null, 2), 'utf8');
      writeFileSync(path.join(outDir, `${table}.csv`), toCsv(rows), 'utf8');
      totalRows += rows.length;
      console.log(`  ✅ ${table}: ${rows.length} dòng`);
    } catch (e) {
      failed.push(table);
      console.log(`  ❌ ${table}: LỖI - ${e.message}`);
    }
  }

  console.log(`\n${failed.length ? '⚠️' : '🎉'} Xong! Tổng cộng ${totalRows} dòng dữ liệu từ ${TABLES.length - failed.length}/${TABLES.length} bảng.`);
  if (failed.length) console.log(`   Các bảng lỗi (kiểm tra lại tên bảng/quyền truy cập): ${failed.join(', ')}`);
  console.log(`   Kết quả nằm trong: ${outDir}\n`);
}

main().catch(e => { console.error('\n❌ Lỗi không mong muốn:', e.message); process.exit(1); });
