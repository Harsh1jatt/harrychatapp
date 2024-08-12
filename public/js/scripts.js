const input = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const socket = io();
const roomId = '<%= roomId %>';

// Join the room when the page loads
socket.emit('joinRoom', { roomId });
console.log(`Joining room: ${roomId}`);

// Load previous messages
socket.on('previousMessages', (messages) => {
    messages.forEach((msg) => {
        const messageType = (msg.senderId === socket.id) ? 'sent' : 'received';
        displayMessage(msg.message, messageType);
    });
});

// Send message on button click
sendButton.addEventListener('click', function() {
    const message = input.value.trim();
    
    if (message) {
        // Emit the message to the server
        socket.emit('message', { roomId, message, senderId: socket.id });
        console.log(`Sent message: ${message} to room: ${roomId}`);

        // Display sent message
        displayMessage(message, 'sent');

        // Clear input field
        input.value = '';
        input.focus();

        // Disable send button
        sendButton.setAttribute('disabled', 'true');
    }
});

// Enable send button based on input
input.addEventListener('input', function() {
    if (input.value.trim() === '') {
        sendButton.setAttribute('disabled', 'true');
    } else {
        sendButton.removeAttribute('disabled');
    }
});

// Send message on Enter key press
input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !sendButton.hasAttribute('disabled')) {
        event.preventDefault();
        sendButton.click();
    }
});

// Display received messages
socket.on('message', (message) => {
    console.log(`Received message: ${message.message} from room: ${message.roomId}`);
    if (message.senderId !== socket.id) {
        displayMessage(message.message, 'received');
    }
});

// Function to display messages
function displayMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = message;

    if (type === 'sent') {
        messageDiv.style.color = 'darkgreen';
    } else if (type === 'received') {
        messageDiv.style.color = 'lightgreen';
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initial button state
if (input.value.trim() === '') {
    sendButton.setAttribute('disabled', 'true');
}
