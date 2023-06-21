function setMyCommands(bot, commands) {
  bot.setMyCommands(commands);
}
function startCommand(bot) {
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

    bot.sendMessage(msg.chat.id, `Привіт ${msg.from.first_name}, обери наступну команду!`, opts);
  });
}

module.exports = {
  setMyCommands,
  startCommand,
};
