const User = require('../models/userModel');

async function changePlace(bot, chatId) {
  let placeChanged = false;

  bot.sendMessage(chatId, 'Введіть місце проживання:');

  const listener = async (msg, match) => {
    if (placeChanged) {
      return;
    }

    const place = match.input;

    try {
      const user = await User.findOneAndUpdate(
        { userId: msg.from.id },
        { place },
        { returnNewDocument: false },
      );

      if (user) {
        placeChanged = true;
        bot.sendMessage(chatId, 'Місце проживання оновлено');
      } else {
        bot.sendMessage(chatId, 'Неможливо змінити місце проживання неіснуючому користувачу');
      }
    } catch (error) {
      console.error('Помилка при зміні місця проживання:', error);
      bot.sendMessage(chatId, 'Сталася помилка при зміні місця проживання');
    }

    bot.removeTextListener(listener);
  };

  return bot.onText(/(.+)/, listener);
}

module.exports = changePlace;
