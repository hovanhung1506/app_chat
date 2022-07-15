const User = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const usernameCheck = await User.findOne({ username: req.body.username });
    if (usernameCheck) return res.json({ msg: 'Username already exists', status: false });
    const emailCheck = await User.findOne({ email: req.body.email });
    if (emailCheck) return res.json({ msg: 'Emnail already exists', status: false });
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const { password, ...others } = user._doc;
    return res.json({ msg: 'User created', status: true, user: others });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.json({ msg: 'Incorrect username or password', status: false });
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) return res.json({ msg: 'Incorrect username or password', status: false });
    const { password, ...others } = user._doc;
    return res.json({ msg: 'Login successfully', status: true, user: others });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage: avatarImage,
      },
      { new: true }
    );
    return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
  } catch (error) {
    next(error);
  }
};

module.exports.allUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'username',
      'avatarImage',
      '_id',
    ]);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
