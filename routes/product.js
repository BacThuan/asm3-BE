const { Router } = require("express");
const productRouter = Router();

const isAdmin = require("../middleware/is-admin");

const productController = require("../controllers/product");

productRouter.get("/products", productController.find);
productRouter.get("/products/details", productController.details);

productRouter.get("/products/:productId", isAdmin, productController.getEdit);

productRouter.post("/products", isAdmin, productController.add);

productRouter.put("/products/:productId", isAdmin, productController.edit);

productRouter.delete("/products/:productId", isAdmin, productController.delete);
module.exports = productRouter;
