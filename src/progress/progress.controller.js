const progressService = require("./progress.service");
const { success, error } = require("../shared/utils/response");

const getProgress = async (req, res, next) => {
  try {
    const data = await progressService.getUserProgress(req.user._id);
    return success(res, data, "Progress retrieved");
  } catch (err) {
    next(err);
  }
};

const submitLevelScore = async (req, res, next) => {
  try {
    const { level, score } = req.body;

    if (level === undefined || score === undefined) {
      return error(res, "level and score are required", 400);
    }

    const data = await progressService.submitLevelScore(req.user._id, { level, score });
    return success(res, data, "Level score submitted");
  } catch (err) {
    next(err);
  }
};

module.exports = { getProgress, submitLevelScore };
