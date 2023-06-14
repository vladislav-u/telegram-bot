const TelegramBot = require('node-telegram-bot-api');

const token = '6017368617:AAEMvszrKzl1tsleNOLp4ObNgTwnEj2BrZQ';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
	bot.sendMessage(msg.chat.id, 'Hello user');
});
