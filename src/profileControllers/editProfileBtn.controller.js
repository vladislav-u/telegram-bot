async function editProfile(bot, chatId) {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Картинка', callback_data: 'changePicture' },
          { text: 'Опис', callback_data: 'changeDescription' },
        ],
        [
          { text: 'Вік', callback_data: 'changeAge' },
          { text: 'Місто проживання', callback_data: 'changePlace' },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, 'Оберіть що ви хочете змінити', opts);
}

module.exports = editProfile;
