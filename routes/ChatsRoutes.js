// routes/ChatsRoutes.js
const express = require('express');
const router = express.Router();
const { allChats } = require('../controllers/allChats');
const { protect } = require('../middlewares/isloggedin');
const userModel = require('../models/userModel')
const Message = require('../models/messageModel');

function generateRoomId(userId1, userId2) {
    return [userId1, userId2].sort().join('_');
}


router.get('/', protect, allChats);



// Example route handler in ChatRoutes.js
router.get('/:userId', protect, async (req, res) => {
    try {
        const userId = req.params.userId;
        const currentUser = req.user;
        const otherUser = await userModel.findOne({ _id: userId });
        const messages = await Message.find({
            $or: [
                { senderId: currentUser._id, recipientId: userId },
                { senderId: userId, recipientId: currentUser._id }
            ]
        }).sort({ timestamp: 1 });

        // Generate roomId
        const roomId = generateRoomId(currentUser._id, userId);

        res.render('index', { messages, currentUser, otherUser, roomId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/deleteAll/:roomId', protect, async (req, res) => {
    try {
        const { roomId } = req.params;
        await Message.deleteMany({ roomId });
        res.status(200).json({ message: 'All messages deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete messages' });
    }
});


module.exports = router;
