const mongoose = require('mongoose');

const connectDB = async () => {
    try{
    mongoose.connect(process.env.MONGODB_URI);
    console.log('connected to db')
    }
    catch(err){
        console.log('mongodb connection error', err.message);
        process.exit(1);
    }
}

module.exports = connectDB;