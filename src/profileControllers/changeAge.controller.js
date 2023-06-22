const User = require('../models/userModel');

async function changeAge(bot, chatId) {
  bot.sendMessage(chatId, 'Введіть ваш вік:');

  const response = await bot.onText(/^\d+$/, async (msg, match) => {
    const age = parseInt(match.input, 10);

    if (!Number.isNaN(age) && age > 0) {
      const ageChanged = await User.findOneAndUpdate(
        { userId: msg.from.id },
        {
          age,
        },
        {
          returnNewDocument: false,
        },
      );

      if (ageChanged) {
        return bot.sendMessage(chatId, `Ваш вік встановлено як ${age}`);
      }
      return bot.sendMessage(chatId, 'Неможливо змінити вік неіснуючому користувачу');
    }

    bot.sendMessage(chatId, 'Введений вік є невірним');

    return bot.removeTextListener(response);
  });
}

module.exports = changeAge;
