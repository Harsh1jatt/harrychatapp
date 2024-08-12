const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel')
module.exports.protect = async (req, res, next) => {
    if (req.cookies.token) {
        try {
            const data = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            req.user =  await userModel.findOne({ username: data.username }).select('-password');
            next()
        }
        catch(err){
            res.status(401).send('not authorized');
        }
    }
    if(!req.cookies.token){
        res.status(401).send("Not Authorized, You don't have access to open this");
        
    }
}