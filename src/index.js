const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const { createWriteStream } = require('fs');
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
			inline_keyboard: [
				[{ text: 'Зареєструватися', callback_data: 'register_profile' }],
				[
					{ text: 'Переглянути профіль', callback_data: 'check_profile' },
					{ text: 'Редагувати профіль', callback_data: 'change_profile' },
				],
			],
		},
	};

	bot.sendMessage(
		msg.chat.id,
		`Привіт ${msg.from.first_name}, обери наступну команду!`,
		opts
	);
});

bot.on('callback_query', async (query) => {
	const chatId = query.message.chat.id;
	const buttonData = query.data;

	switch (buttonData) {
		case 'register_profile':
			await registerProfile(query.from);
			break;
		case 'change_profile':
			const opts = {
				reply_markup: {
					inline_keyboard: [
						[
							{ text: 'Картинка', callback_data: 'change_picture' },
							{ text: 'Опис', callback_data: 'change_description' },
						],
					],
				},
			};

			bot.sendMessage(chatId, 'Оберіть що ви хочете змітини', opts);
			break;
		case 'change_picture':
			bot.sendMessage(chatId, 'Надішліть картинку');
			await saveProfilePicture();
			break;
		case 'check_profile':
			const user = await User.findOne({ userId: query.from.id });
			bot.sendMessage(chatId, `${user}`);
			break;
	}
});

async function registerProfile(userData) {
	const { id, first_name, last_name, username } = userData;
	const exists = await User.findOne({ userId: id });

	if (exists) {
		bot.sendMessage(id, 'Такий користувач вже існує');
	} else {
		const user = new User({
			userId: id,
			userName: username,
			firstName: first_name,
			lastName: last_name,
		});

		await user.save();
		bot.sendMessage(id, 'Користувача було зареєстровано');
	}
}

async function saveProfilePicture() {
	bot.on('photo', async (msg) => {
		const fileStream = await bot.getFileStream(
			msg.photo[msg.photo.length - 1].file_id
		);
		fileStream.pipe(
			createWriteStream(`.\\src\\public\\profileImages\\${msg.from.id}.jpg`)
		);

		const pfp = await User.findOneAndUpdate(
			{ userId: msg.from.id },
			{
				profilePicture: path.join(
					__dirname,
					`.\\public\\profileImages\\${msg.from.id}.jpg`
				),
			},
			{
				returnNewDocument: false,
			}
		);

		if (pfp) {
			bot.sendMessage(msg.from.id, 'Картинка профілю змінена успішно');
		} else {
			bot.sendMessage(
				msg.from.id,
				'Неможливо додати картинку неіснуючому користувачу'
			);
		}
	});
}
