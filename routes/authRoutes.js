const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, showProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/isloggedin');

router.post('/register', registerUser);
router.post('/login', loginUser); // Add loginUser handler
router.get('/logout', logoutUser); // Add logoutUser handler
router.get('/profile',protect, showProfile); // Add showProfile handler

module.exports = router;
