const handler = async (axmisu, m, { prefix }) => {
  const mode = global.db.botPublic ? 'Public' : 'Self';
  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const mnt = Math.floor((uptime % 3600) / 60);
  const s = Math.floor(uptime % 60);

  const teks = `╭─「 *${global.botname}* 」
│ Mode    : ${mode}
│ Uptime  : ${h}j ${mnt}m ${s}d
│ Website : axmisu.biz.id
╰────────────────

*DAFTAR COMMAND*
1. ${prefix}menu     - Tampilkan menu ini
2. ${prefix}self      - (owner) Set bot mode self
3. ${prefix}public  - (owner) Set bot mode public
4. ${prefix}brat      - Bikin stiker brat dari teks
5. ${prefix}s          - Ubah gambar/video/gif jadi stiker (reply media)
6. ${prefix}tt         - Download video TikTok${global.enableEval ? `\n7. ${prefix}run       - (owner) Eval kode JS ke bot, cth: .run m.reply('hi')` : ''}${global.enableShellExec ? `\n8. $<perintah>    - (owner) Jalanin perintah terminal/shell, cth: $ls -la` : ''}`;

  await m.reply(teks);
};

handler.command = ['menu'];
export default handler;