require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const connectToDatabase = require('./database');
const Commands = require('./commandControllers/start.controller');
const Buttons = require('./buttonControllers/buttonListener.controller');

connectToDatabase();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

Commands.setMyCommands(bot, [{ command: '/start', description: 'Запуск бота' }]);

Commands.startCommand(bot);

Buttons.buttonListener(bot);
