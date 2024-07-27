const userModel = require('../models/userModel');

module.exports.allChats = async (req, res) => {
    let allUsers = await userModel.find();
    let user = req.user;
    res.render('chats', { allUsers, user });
};
