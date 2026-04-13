const jwt = require("jsonwebtoken");
const User = require("./auth.model");
const { error } = require("../shared/utils/response");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, "No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return error(res, "User not found", 401);

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
