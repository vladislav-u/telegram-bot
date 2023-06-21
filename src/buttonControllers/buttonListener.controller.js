const saveProfilePicture = require('./savePictureBtn.controller');
const registerProfile = require('./registerBtn.controller');
const User = require('../models/userModel');

function buttonListener(bot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const buttonData = query.data;

    switch (buttonData) {
      case 'registerProfile': {
        await registerProfile(bot, query.from);
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

        bot.sendMessage(chatId, 'Оберіть що ви хочете змінити', opts);
        break;
      }
      case 'changePicture': {
        bot.sendMessage(chatId, 'Надішліть картинку');
        await saveProfilePicture(bot);
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
}

module.exports = {
  buttonListener,
};
