const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const generateToken = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log('Received data:', req.body);
        
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).send('User Already Exists! Please login');
        }

        const salt = await bcrypt.genSalt();
        console.log('Generated salt:', salt);
        
        const hash = await bcrypt.hash(password, salt);
        console.log('Hashed password:', hash);

        user = await userModel.create({
            email,
            password: hash,
            username
        });

        const token = generateToken({ email });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        res.status(201).redirect('/chats');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};


module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send('User Not Found! Please Create an Account');
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = generateToken({ email });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
            });

            res.status(201).redirect('/chats');
        } else {
            res.status(401).send('Invalid Password');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports.logoutUser = (req, res) => {
    res.cookie('token', "", {
        httpOnly: true,
        secure: true,
    });
    // res.status(201).send('Logged Out Successfully!');
    res.redirect('/login')
};

module.exports.showProfile = (req, res) => {
    res.render('profile');
};
