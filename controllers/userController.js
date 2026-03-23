const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      console.warn(
        `Register failed: Missing fields - ${JSON.stringify(req.body)}`,
      );
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      console.warn(`Register failed: Password too short for ${email}`);
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.signup(name, email, password);
    console.log(`User regesistered successfully :${user.email}`);
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("User registration error:", error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= LOGIN =================

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      console.warn("Login failed: Missing email or password ");

      return res.status(400).json({
        success: false,
        message: "Email and password requires",
      });
    }

    const user = await User.login(email, password);
    const token = generateToken(user._id);
    console.log(`User logged in: ${user.email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("User login error:", error.message);
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
};

module.exports = { registerUser, loginUser };
