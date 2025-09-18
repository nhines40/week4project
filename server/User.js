const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  facebookId: String,
  googleId: String,
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;