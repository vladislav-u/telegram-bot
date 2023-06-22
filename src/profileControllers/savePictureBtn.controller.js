const { createWriteStream } = require('fs');
const path = require('path');
const User = require('../models/userModel');

async function saveProfilePicture(bot) {
  let pictureSaved = false;

  bot.on('photo', async (msg) => {
    if (pictureSaved) {
      return;
    }

    const fileStream = await bot.getFileStream(msg.photo[msg.photo.length - 1].file_id);
    fileStream.pipe(createWriteStream(`.\\src\\public\\profileImages\\${msg.from.id}.jpg`));

    try {
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
        pictureSaved = true;
        bot.sendMessage(msg.from.id, 'Картинка профілю змінена успішно');
      } else {
        bot.sendMessage(msg.from.id, 'Неможливо додати картинку неіснуючому користувачу');
      }
    } catch (error) {
      console.error('Помилка при збереженні картинки профілю:', error);
      bot.sendMessage(msg.from.id, 'Сталася помилка при збереженні картинки профілю');
    }

    bot.removeTextListener(saveProfilePicture);
  });
}

module.exports = saveProfilePicture;
