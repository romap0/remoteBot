const Telegraf = require('telegraf');
const SocksProxyAgent = require('socks-proxy-agent');
const os = require('os');
const { exec } = require('child_process');

const { BOT_TOKEN, CHATS, PROXY } = process.env;

const chats = CHATS.split(',');
const agent = new SocksProxyAgent(PROXY);

const bot = new Telegraf(BOT_TOKEN, { telegram: { agent } });

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
