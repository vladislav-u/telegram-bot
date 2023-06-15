const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel.js');

dotenv.config();

mongoose.connect(
	'mongodb+srv://vladislavulynets:btangapassword@botdb.xhrcfdf.mongodb.net/'
);
mongoose.connection
	.once('open', () => {
		console.log('Connection to database successfully');
	})
	.on('error', (error) => {
		console.log('Connection to database failed', error);
	});

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.setMyCommands([{ command: '/start', description: 'Запуск бота' }]);

bot.onText(/\/start/, (msg) => {
	const opts = {
		reply_markup: {
			resize_keyboard: true,
			one_time_keyboard: true,
			keyboard: [['Зареєструватися', 'Увійти'], ['Редагувати']],
		},
	};

	bot.sendMessage(msg.chat.id, 'Hello user', opts);
});

bot.on('message', (msg) => {
	if (msg.text.toString().toLowerCase().includes('зареєструватися')) {
		register(msg.from);
	}
	if (msg.text.toString().toLowerCase().includes('увійти')) {
		bot.sendMessage(msg.from.id, 'login');
	}
	if (msg.text.toString().toLowerCase().includes('редагувати')) {
		const opts = {
			reply_markup: {
				resize_keyboard: true,
				one_time_keyboard: true,
				keyboard: [['Картинка', 'Опис']],
			},
		};

		bot.sendMessage(msg.chat.id, 'Виберіть, що ви хочете відредагувати', opts);
	}
});

async function register(userData) {
	const { id, first_name, last_name, username } = userData;
	const exists = await User.findOne({ userId: id });

	if (exists) {
		bot.sendMessage(id, 'User already registered');
	} else {
		const user = new User({
			userId: id,
			userName: username,
			firstName: first_name,
			lastName: last_name,
		});

		await user.save();

		bot.sendMessage(id, 'User successfully registered');
	}
}
