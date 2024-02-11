const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../Models/userModel");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = await userModel.findOne({ userName: decoded.userName }).exec();
    next();
  } catch (err) {
    return res.status(401).send("Not authorized, invalid token");
  }
});

module.exports = protect;
