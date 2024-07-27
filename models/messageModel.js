const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: String,
    message: String,
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
