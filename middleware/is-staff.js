module.exports = (req, res, next) => {
  const isAdmin = req.user.isAdmin;
  if (isAdmin !== 1) {
    const error = new Error("Not allowed.");
    error.statusCode = 401;
    throw error;
  }
  next();
};
