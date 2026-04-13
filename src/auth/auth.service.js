const jwt = require("jsonwebtoken");
const User = require("./auth.model");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const register = async ({ nickname, email, password, birthdate }) => {
  const user = await User.create({ nickname, email, password, birthdate });
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      birthdate: user.birthdate,
      score: user.score,
    },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      birthdate: user.birthdate,
      score: user.score,
    },
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user;
};

module.exports = { register, login, getMe };
