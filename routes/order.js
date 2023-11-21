const { Router } = require("express");
const orderRouter = Router();

const orderController = require("../controllers/order");
const isAuth = require("../middleware/is-auth");

orderRouter.post("/orders", isAuth, orderController.placeOrder);
orderRouter.get("/orders/detail", isAuth, orderController.detailOrder);
orderRouter.get("/orders", isAuth, orderController.histories);
orderRouter.get("/orders/count", isAuth, orderController.count);

orderRouter.get("/orders/total", isAuth, orderController.total);

module.exports = orderRouter;
