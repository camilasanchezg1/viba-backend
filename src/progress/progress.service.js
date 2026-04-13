const Progress = require("./progress.model");
const User = require("../auth/auth.model");

/**
 * Get or create the progress document for a user.
 */
const getOrCreateProgress = async (userId) => {
  let progress = await Progress.findOne({ userId });
  if (!progress) {
    progress = await Progress.create({ userId });
  }
  return progress;
};

/**
 * Get the user's full progress, including best score per level.
 */
const getUserProgress = async (userId) => {
  const progress = await getOrCreateProgress(userId);

  // Build a summary: best score per level from the full history
  const bestByLevel = {};
  for (const record of progress.levelHistory) {
    if (
      bestByLevel[record.level] === undefined ||
      record.score > bestByLevel[record.level]
    ) {
      bestByLevel[record.level] = record.score;
    }
  }

  return {
    currentLevel: progress.currentLevel,
    levelHistory: progress.levelHistory,
    bestScoresByLevel: bestByLevel,
  };
};

/**
 * Submit a score for a completed level.
 * - Validates score is between 0 and 5.
 * - Appends to history.
 * - If score > 0 and the completed level is the current one, advances currentLevel.
 * - Updates the user's total score (sum of all best scores).
 */
const submitLevelScore = async (userId, { level, score }) => {
  if (typeof score !== "number" || score < 0 || score > 5) {
    throw Object.assign(new Error("Score must be a number between 0 and 5"), { statusCode: 400 });
  }

  if (typeof level !== "number" || level < 1) {
    throw Object.assign(new Error("Level must be a positive number"), { statusCode: 400 });
  }

  const progress = await getOrCreateProgress(userId);

  // Append the new record
  progress.levelHistory.push({ level, score, completedAt: new Date() });

  // Advance current level if the player passed the current one (score > 0)
  if (score > 0 && level === progress.currentLevel) {
    progress.currentLevel = level + 1;
  }

  await progress.save();

  // Recalculate user's total score = sum of best scores per level
  const bestByLevel = {};
  for (const record of progress.levelHistory) {
    if (
      bestByLevel[record.level] === undefined ||
      record.score > bestByLevel[record.level]
    ) {
      bestByLevel[record.level] = record.score;
    }
  }
  const totalScore = Object.values(bestByLevel).reduce((acc, s) => acc + s, 0);
  await User.findByIdAndUpdate(userId, { score: totalScore });

  return {
    currentLevel: progress.currentLevel,
    submittedRecord: { level, score },
    bestScoresByLevel: bestByLevel,
    totalScore,
  };
};

module.exports = { getUserProgress, submitLevelScore };
