// utils/generateToken.js

const jwt = require("jsonwebtoken");

/*
  Generate JWT Token
  Payload contains user _id
*/
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
};

module.exports = generateToken;
