module.exports = (req, res, next) => {
  const isAdmin = req.session.user.isAdmin;
  if (isAdmin !== 0) {
    const error = new Error("Not allowed.");
    error.statusCode = 401;
    throw error;
  }
  next();
};
