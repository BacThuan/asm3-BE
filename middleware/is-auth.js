module.exports = (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  next();
};
