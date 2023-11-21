const { Router } = require("express");

const userController = require("../controllers/user");
const userRouter = Router();
const isAuth = require("../middleware/is-auth");

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/logout", userController.logout);
userRouter.post("/admin/login", userController.adminLogin);
userRouter.get("/users/count", isAuth, userController.count);
userRouter.get("/checkSession", isAuth, userController.dummy);

module.exports = userRouter;
