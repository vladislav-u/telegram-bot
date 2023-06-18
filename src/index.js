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
        [{ text: 'Зареєструватися', callback_data: 'registerProfile' }],
        [
          { text: 'Переглянути профіль', callback_data: 'checkProfile' },
          { text: 'Редагувати профіль', callback_data: 'changeProfile' },
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
    case 'registerProfile': {
      await registerProfile(query.from);
      break;
    }
    case 'changeProfile': {
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Картинка', callback_data: 'changePicture' },
              { text: 'Опис', callback_data: 'changeDescription' },
            ],
          ],
        },
      };

      bot.sendMessage(chatId, 'Оберіть що ви хочете змітини', opts);
      break;
    }
    case 'changePicture': {
      bot.sendMessage(chatId, 'Надішліть картинку');
      await saveProfilePicture();
      break;
    }
    case 'checkProfile': {
      const user = await User.findOne({ userId: query.from.id });
      bot.sendMessage(chatId, `${user}`);
      break;
    }
    default: {
      break;
    }
  }
});

async function registerProfile(userData) {
  const { userId, firstName, lastName, userName } = userData;
  const exists = await User.findOne({ userId });

  if (exists) {
    bot.sendMessage(userId, 'Такий користувач вже існує');
  } else {
    const user = new User({
      userId,
      userName,
      firstName,
      lastName,
    });

    await user.save();
    bot.sendMessage(userId, 'Користувача було зареєстровано');
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
