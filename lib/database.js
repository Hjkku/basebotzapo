/* BASE BOT WA BY AXMISU 
BASE INI GRATIS! TIDAK UNTUK DIPERJUALKAN BELIKAN! KALIAN BEBAS OTAK ATIK BASE INI. 

AUTHOR : AXMISU

promosi dikit :v. kalian butuh panel? kunjungi
WEBSITE : AXMISU.BIZ.ID

KOMUNITAS : AXMISU.BIZ.ID/GRUP
SALURAN : AXMISU.BIZ.ID/SALURAN
OWNER TELE : AXMISU.BIZ.ID/HUBUNGITELEGRAM
OWNER WA : AXMISU.BIZ.ID/HUBUNGIWA
*/

import fs from 'fs';
import path from 'path';

const dbFolder = path.join(process.cwd(), 'database');
const dbPath = path.join(dbFolder, 'database.json');

const defaultDB = {
  botPublic: true,
};

export function loadDatabase() {
  if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });

  global.db = { ...defaultDB };

  if (fs.existsSync(dbPath)) {
    try {
      const content = fs.readFileSync(dbPath, 'utf-8');
      const parsed = JSON.parse(content || '{}');
      global.db = { ...defaultDB, ...parsed };
    } catch (e) {
      console.error('[DB] Gagal membaca database.json, menggunakan nilai default:', e.message);
      saveDatabase();
    }
  } else {
    saveDatabase();
  }
}

// Simpan isi global.db ke database.json
export function saveDatabase() {
  try {
    if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(global.db || defaultDB, null, 2), 'utf-8');
  } catch (e) {
    console.error('[DB] Gagal menyimpan database.json:', e.message);
  }
}
