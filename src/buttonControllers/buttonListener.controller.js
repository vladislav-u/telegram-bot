const saveProfilePicture = require('../profileControllers/savePictureBtn.controller');
const registerProfile = require('../profileControllers/registerBtn.controller');
const editProfile = require('../profileControllers/editProfileBtn.controller');
const checkProfile = require('../profileControllers/checkProfileBtn.controller');
const changeAge = require('../profileControllers/changeAge.controller');
const changeDescription = require('../profileControllers/changeDescription.controller');
const changePlace = require('../profileControllers/changePlace.controller');

function buttonListener(bot) {
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const buttonData = query.data;

    switch (buttonData) {
      case 'registerProfile': {
        await registerProfile(bot, query.from);
        break;
      }
      case 'editProfile': {
        await editProfile(bot, chatId);
        break;
      }
      case 'changePicture': {
        bot.sendMessage(chatId, 'Надішліть картинку');
        await saveProfilePicture(bot);
        break;
      }
      case 'checkProfile': {
        await checkProfile(bot, chatId);
        break;
      }
      case 'changeAge': {
        await changeAge(bot, chatId);
        break;
      }
      case 'changeDescription': {
        await changeDescription(bot, chatId);
        break;
      }
      case 'changePlace': {
        await changePlace(bot, chatId);
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
