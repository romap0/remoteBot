const Telegraf = require('telegraf');
const os = require('os');
const { exec } = require('child_process');

const { BOT_TOKEN, CHATS } = process.env;

const chats = CHATS.split(',');

const bot = new Telegraf(BOT_TOKEN);

bot.command('/ip', (ctx) => {
  const ips = Object.values(os.networkInterfaces())
    .reduce((acc, ifaces) => ([
      ...acc,
      ...ifaces.filter((iface) => iface.family === 'IPv4').map((iface) => iface.address),
    ]), [])
    .map((ip) => `\`${ip}\``)
    .join('\n');

  ctx.replyWithMarkdown(ips);
});

bot.on('text', (ctx) => {
  exec(ctx.message.text, (err, stdout, stderr) => {
    ctx.reply(err);
    ctx.reply(stdout);
    ctx.reply(stderr);
  });
});

bot.startPolling();

chats.forEach((chatId) => bot.telegram.sendMessage(chatId, 'Hi, I`m awake'));
