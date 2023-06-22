const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  age: {
    type: Number,
  },
  description: {
    type: String,
  },
  place: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
});

module.exports = mongoose.model('User', userSchema);
