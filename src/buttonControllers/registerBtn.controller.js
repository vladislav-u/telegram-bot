const User = require('../models/userModel');

async function registerProfile(bot, userData) {
  const {
    id: userId,
    username: userName,
    first_name: firstName,
    last_name: lastName,
  } = userData;

  const exists = await User.findOne({ userId });

  if (exists) {
    bot.sendMessage(userId, 'Такий користувач вже існує');
  } else {
    const user = new User({
      userId,
      userName,
      firstName,
      lastName,
    });

    await user.save();
    bot.sendMessage(userId, 'Користувача було зареєстровано');
  }
}

module.exports = registerProfile;
