const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  code: String,
  avatar: {
    type: String,  // URL for the user's profile picture
    default: 'ashwithpikachu.jpg'  // Default avatar image
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
