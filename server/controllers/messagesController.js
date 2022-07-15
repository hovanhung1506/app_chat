const Message = require('../models/messageModel');

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, timestamps } = req.body;
    const data = await Message.create({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
      createdAt: timestamps,
      updatedAt: timestamps,
    });
    if (data) return res.json({ msg: 'Message added successfully' });
    return res.json({ msg: 'Message not added' });
  } catch (error) {
    next(error);
  }
};
module.exports.getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        timestamps: new Date(msg.updatedAt).toLocaleString('en-AU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    });
    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
