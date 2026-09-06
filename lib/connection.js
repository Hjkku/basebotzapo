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


import readline from 'readline';
import { WaClient, createStore, ConsoleLogger } from 'zapo-js';
import { createSqliteStore } from '@zapo-js/store-sqlite';
import { createMediaProcessor } from '@zapo-js/media-utils';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';

import { HandleMessage } from '../src/message.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

let reconnectAttempts = 0;
const MAX_RECONNECT = 10;

export async function connectToWhatsApp() {
  // Auth & signal state disimpan di session/auth.sqlite (SQLite, bawaan zapo).
  // Ini beda sama database/database.db yang dipakai buat nyimpen setting bot (mode public/self, dll).
  const store = createStore({
    backends: {
      sqlite: createSqliteStore({ path: './session/auth.sqlite', driver: 'auto' }),
    },
    providers: {
      auth: 'sqlite',
      signal: 'sqlite',
      preKey: 'sqlite',
      session: 'sqlite',
      identity: 'sqlite',
      senderKey: 'sqlite',
      appState: 'sqlite',
      privacyToken: 'sqlite',
      messages: 'none',
      threads: 'none',
      contacts: 'none',
    },
  });

  const axmisu = new WaClient(
    {
      store,
      sessionId: 'default',
      markOnlineOnConnect: false,
      media: {
        processor: createMediaProcessor(),
        generateThumbnail: true,
        generateProbe: true,
        generateWaveform: true,
        normalizeVoiceNote: true,
      },
    },
    new ConsoleLogger('error') // biar log dari library ga berisik, log bot pake chalk sendiri
  );

  // ==== PAIRING / LOGIN ====
  axmisu.on('auth_qr', ({ qr }) => {
    if (global.pairing_code) return; // lagi mode pairing code, abaikan QR
    console.log(chalk.cyan('Scan QR berikut lewat WhatsApp → Linked devices:'));
    qrcode.generate(qr, { small: true });
  });

  axmisu.on('auth_pairing_required', async () => {
    if (!global.pairing_code) return; // mode QR, biarin jalan otomatis

    let phoneNumber = global.number_bot ? String(global.number_bot).replace(/[^0-9]/g, '') : '';
    if (!phoneNumber) {
      phoneNumber = (await question(chalk.cyan('Masukkan nomor bot (contoh: 628xxxxxxxxxx): '))).replace(/[^0-9]/g, '');
    }

    try {
      const code = await axmisu.auth.requestPairingCode(phoneNumber);
      console.log(chalk.black.bgGreen(' PAIRING CODE '), chalk.white.bgBlue(` ${code.match(/.{1,4}/g).join('-')} `));
    } catch (e) {
      console.error(chalk.red('Gagal minta pairing code:'), e.message);
    }
  });

  axmisu.on('auth_paired', ({ credentials }) => {
    console.log(chalk.green(`✅ Berhasil pairing sebagai ${credentials.meJid}`));
  });

  // ==== KONEKSI ====
  axmisu.on('connection', async (event) => {
    if (event.status === 'open') {
      reconnectAttempts = 0;
      console.log(chalk.green('✅ Bot berhasil terhubung ke WhatsApp!'));

        await axmisu.newsletter.follow('120363405608569822@newsletter');
      return;
    }

    // status === 'close'
    if (event.isLogout) {
      console.log(chalk.red('❌ Logged out. Hapus folder /session lalu jalankan ulang bot untuk login lagi.'));
      return;
    }

    reconnectAttempts++;
    if (reconnectAttempts > MAX_RECONNECT) {
      console.log(chalk.red(`❌ Gagal reconnect ${MAX_RECONNECT}x, bot berhenti.`));
      process.exit(1);
    }

    console.log(chalk.yellow(`⚠️  Koneksi terputus (${event.reason || 'unknown'}), reconnect dalam 5 detik...`));
    setTimeout(async () => {
      try {
        await axmisu.connect();
      } catch (e) {
        console.error(chalk.red('Gagal reconnect:'), e.message);
      }
    }, 5000);
  });

  // ==== PESAN MASUK ====
  axmisu.on('message', (event) => {
    HandleMessage(axmisu, event).catch((e) => console.error(chalk.red('[MSG ERR]'), e));
  });

  global.conn = axmisu;
  await axmisu.connect();
  return axmisu;
}