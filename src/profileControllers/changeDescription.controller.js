const User = require('../models/userModel');

async function changeDescription(bot, chatId) {
  let descriptionChanged = false;

  bot.sendMessage(chatId, 'Введіть опис профілю:');

  const listener = async (msg, match) => {
    if (descriptionChanged) {
      return;
    }

    const description = match.input;

    try {
      const user = await User.findOneAndUpdate(
        { userId: msg.from.id },
        { description },
        { returnNewDocument: true },
      );

      if (user) {
        descriptionChanged = true;
        bot.sendMessage(chatId, 'Опис профілю оновлено');
      } else {
        bot.sendMessage(chatId, 'Неможливо змінити опис неіснуючому користувачу');
      }
    } catch (error) {
      console.error('Помилка при зміні опису:', error);
      bot.sendMessage(chatId, 'Сталася помилка при зміні опису');
    }
  };

  return bot.onText(/(.+)/, listener);
}

module.exports = changeDescription;
