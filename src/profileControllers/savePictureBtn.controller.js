const { createWriteStream } = require('fs');
const path = require('path');
const User = require('../models/userModel');

async function saveProfilePicture(bot) {
  bot.on('photo', async (msg) => {
    const fileStream = await bot.getFileStream(msg.photo[msg.photo.length - 1].file_id);
    fileStream.pipe(createWriteStream(`.\\src\\public\\profileImages\\${msg.from.id}.jpg`));

    const pfp = await User.findOneAndUpdate(
      { userId: msg.from.id },
      {
        profilePicture: path.join(__dirname, `.\\public\\profileImages\\${msg.from.id}.jpg`),
      },
      {
        returnNewDocument: false,
      },
    );

    if (pfp) {
      bot.sendMessage(msg.from.id, 'Картинка профілю змінена успішно');
    } else {
      bot.sendMessage(msg.from.id, 'Неможливо додати картинку неіснуючому користувачу');
    }
  });
}

module.exports = saveProfilePicture;
