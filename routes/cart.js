const { Router } = require("express");
const cartRouter = Router();

const cartController = require("../controllers/cart");
const isAuth = require("../middleware/is-auth");

cartRouter.get("/carts", isAuth, cartController.detail);
cartRouter.post("/carts/add", isAuth, cartController.add);
cartRouter.put("/carts/update", isAuth, cartController.update);
cartRouter.delete("/carts/delete", isAuth, cartController.delete);

module.exports = cartRouter;
