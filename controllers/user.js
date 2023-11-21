const bcrypt = require("bcryptjs");
const User = require("../models/user");
const createError = require("../util/error.js").createError;

exports.register = async (req, res, next) => {
  const tempUser = await User.findOne({ email: req.body.email });
  if (tempUser) return next(createError(409, "Email has been used!"));
  else {
    const encryptedPassword = await bcrypt.hash(req.body.password, 12);
    try {
      const newUser = new User({ ...req.body, password: encryptedPassword });
      await newUser.save();

      res.status(200).send("User has been created.");
    } catch (err) {
      next(err);
    }
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return next(createError(404, "User not found!"));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(createError(400, "Invalid password!"));
    else {
      req.session.user = user;
      await req.session.save();

      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) return next(createError(404, "User not found!"));

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return next(createError(400, "Invalid password!"));
    else if (user.isAdmin >= 2) {
      return next(createError(401, "You are not allowed!"));
    }
    //
    else {
      req.session.user = user;
      await req.session.save();
      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      next(err);
    });
    res.json("Log out");
  } catch (err) {
    next(err);
  }
};
exports.count = async (req, res, next) => {
  try {
    const count = await User.countDocuments();

    res.json(count);
  } catch (err) {
    next(err);
  }
};

exports.dummy = async (req, res, next) => {
  res.json("OK");
};
