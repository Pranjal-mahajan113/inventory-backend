const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  { timestamps: true },
);

/*
  STATIC SIGNUP METHOD
  - Check duplicate email
  - Hash password
  - Save user
*/
userSchema.statics.signup = async function (name, email, password) {
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already exists");
  }
  // Generate salt (security layer)
  const salt = await bcrypt.genSalt(10);

  // Hash password
  const hash = await bcrypt.hash(password, salt);

  // Create user with hashed password
  const user = await this.create({ name, email, password: hash });
  return user;
};

/*
  STATIC LOGIN METHOD
  - Check email exists
  - Compare password
*/
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Invalid Email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid Password");
  }
  return user;
};
const User = mongoose.model("User", userSchema);

module.exports = User;