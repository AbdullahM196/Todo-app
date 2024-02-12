const userModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const saveImage = require("../config/saveToCloudinary");
const cloudinary = require("cloudinary").v2;
const register = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const duplicateUserName = await userModel.findOne({ userName }).exec();
  if (duplicateUserName) {
    return res.status(409).json({ message: "userName already in use" });
  }
  const duplicateEmail = await userModel.findOne({ email }).exec();
  if (duplicateEmail) {
    return res.status(409).json({ message: "Email already in use" });
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  const Token = jwt.sign({ userName }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", Token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  const user = await userModel.create({
    userName: userName,
    email: email,
    password: hashedPassword,
    Token: Token,
  });
  return res.status(201).json({
    userName: user.userName,
    email: user.email,
    img: user.img,
  });
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  const emailReg = /^[a-zA-Z0-9.]{2,}@((gmail|yahoo|outlook)\.com)$/i;
  if (!emailReg.test(email)) {
    return res.status(403)("Please enter a valid email");
  }
  const findUser = await userModel.findOne({ email }).exec();
  if (!findUser) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
  const match = await bcrypt.compare(password, findUser.password);
  if (!match) {
    return res.status(404).json({ message: "Invalid credentials" });
  }
  const Token = jwt.sign(
    { userName: findUser.userName },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("jwt", Token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  findUser.Token = Token;
  await findUser.save();
  return res.status(201).json({
    userName: findUser.userName,
    email,
    img: findUser.img,
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const Token = cookies.jwt;

  const foundUser = await userModel.findOne({ Token });
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204);
  }

  // Delete Token in db
  foundUser.Token = "";
  await foundUser.save();
  req.user = "";
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
});
const profile = asyncHandler(async (req, res) => {
  if (req.user) {
    const user = req.user;
    return res.status(200).json({
      userName: user.userName,
      email: user.email,
      img: user.img,
    });
  } else {
    return res.status(401).json({ message: "Not authorized" });
  }
});
const editProfile = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const img = req.file;
  if (req.user) {
    const user = req.user;
    user.userName = userName || user.userName;
    user.email = email || user.email;
    if (password) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (img) {
      try {
        if (user.img?.public_id) {
          await cloudinary.uploader.destroy(user.img.public_id);
        }
        user.img = await saveImage(img);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
    }
    const updatedUser = await user.save();
    res.status(200).json({
      userName: updatedUser.userName,
      email: updatedUser.email,
      img: updatedUser.img,
    });
    req.user = updatedUser;
  } else {
    res.status(401);
    throw new Error("Not authorized");
  }
});
module.exports = {
  register,
  login,
  logout,
  profile,
  editProfile,
};
