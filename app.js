require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const authRouter = require('./routes/authRoutes');
const ChatsRouter = require('./routes/ChatsRoutes');
const connectDB = require('./config/mongoose-connection');
const cookieParser = require('cookie-parser');
const Message = require('./models/messageModel');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
connectDB();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/chats', ChatsRouter);

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', async ({ roomId }) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);

        // Emit previous messages
        const messages = await Message.find({ roomId });
        socket.emit('previousMessages', messages);
    });

    socket.on('message', async (messageData) => {
        const { roomId, message, senderId } = messageData;
        const newMessage = new Message({ roomId, message, senderId, timestamp: new Date() });
        await newMessage.save();
    
        // Broadcast the new message to all users in the room
        io.to(roomId).emit('message', { ...messageData, _id: newMessage._id, timestamp: newMessage.timestamp });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.redirect('/register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
