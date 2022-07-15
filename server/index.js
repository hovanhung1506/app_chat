const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const socket = require('socket.io');
require('dotenv').config();
const helmet = require('helmet');
const app = express();

(async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@learn-nodejs.y7fc58j.mongodb.net/chat_app?retryWrites=true&w=majority`
    );
    console.log('Connected Mongodb');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();

app.use(cors());
app.use(express.json());
app.use(helmet());

const userRoute = require('./routes/userRoutes');
const messageRoute = require('./routes/messagesRoutes');

app.use('/api/auth', userRoute);
app.use('/api/messages', messageRoute);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const io = socket(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

global.onlineUser = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUser.set(userId, socket.id);
  });
  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUser.get(data.to);
    if (sendUserSocket) {
      io.to(sendUserSocket).emit('msg-recieve', data.message, data.timestamps);
    }
  });
});
