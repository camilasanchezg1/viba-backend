const authService = require("./auth.service");
const { success, error } = require("../shared/utils/response");

const register = async (req, res, next) => {
  try {
    const { nickname, email, password, birthdate } = req.body;

    if (!nickname || !email || !password) {
      return error(res, "nickname, email and password are required", 400);
    }

    const result = await authService.register({ nickname, email, password, birthdate });
    return success(res, result, "User registered successfully", 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "email and password are required", 400);
    }

    const result = await authService.login({ email, password });
    return success(res, result, "Login successful");
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    return success(res, user, "User retrieved successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
