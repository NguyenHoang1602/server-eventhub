const UserModel = require("../models/userModel");
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const getToken = async (email, _id) => {
  const token = jwt.sign({ email, _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
  return token;
}
const register = asyncHandler(async (req, res) => {
  const data = req.body;
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const salt = await bycrypt.genSalt(10);
  const hashPassword = await bycrypt.hash(data.password, salt);
  const user = new UserModel({
    fullName: data.fullName,
    email: data.email,
    password: hashPassword,
    photoUrl: '',
  });
  await user.save();
  res.status(200).json({
    id: user._id,
    email: user.email,
    assetToken: await getToken(data.email, user._id),
    message: 'Register Successfully!!!!!!!!!',
  });

})
const login = async (req, res) => {
  console.log(req.body);
  res.send("Register Succesfully!");
}

module.exports = { register, login }