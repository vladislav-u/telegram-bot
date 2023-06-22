const User = require('../models/userModel');

async function changeAge(bot, chatId) {
  let ageChanged = false;

  bot.sendMessage(chatId, 'Введіть ваш вік:');

  const listener = async (msg, match) => {
    if (ageChanged) {
      return;
    }

    const age = parseInt(match.input, 10);

    if (!Number.isNaN(age) && age > 0) {
      try {
        const user = await User.findOneAndUpdate(
          { userId: msg.from.id },
          { age },
          { returnNewDocument: false },
        );

        if (user) {
          ageChanged = true;
          bot.sendMessage(chatId, `Ваш вік встановлено як ${age}`);
        } else {
          bot.sendMessage(chatId, 'Неможливо змінити вік неіснуючому користувачу');
        }
      } catch (error) {
        console.error('Помилка при зміні віку:', error);
        bot.sendMessage(chatId, 'Сталася помилка при зміні віку');
      }
    } else {
      bot.sendMessage(chatId, 'Введений вік є невірним');
    }

    bot.removeTextListener(listener);
  };

  return bot.onText(/^\d+$/, listener);
}

module.exports = changeAge;
