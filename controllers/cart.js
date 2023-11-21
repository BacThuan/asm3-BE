const Cart = require("../models/cart");
const Product = require("../models/product");
const createError = require("../util/error.js").createError;

exports.detail = async (req, res, next) => {
  const idUser = req.query.userId;
  try {
    const cart = await Cart.findOne({ idUser: idUser }).lean();
    if (cart) {
      const products = await Promise.all(
        cart.products.map(async (product) => {
          const productInfo = await Product.findById(product.idProduct);
          return { product: productInfo, count: product.count };
        })
      );

      res.json(products);
    } else res.json([]);
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  const { count, productId, userId } = req.body;
  try {
    const cart = await Cart.findOne({ idUser: userId }).lean();

    // if user had cart
    if (cart) {
      const products = cart.products;
      const index = products.findIndex(
        (product) => product.idProduct === productId
      );

      // no product
      if (index === -1) products.push({ idProduct: productId, count: count });
      //
      // cart already had product
      else {
        let oldCount = products[index].count;
        products[index].count = oldCount + count;
      }

      updateCart(userId, products, res);
    }

    // user dont have cart
    else {
      await Cart.create({
        idUser: userId,
        products: [{ idProduct: productId, count: count }],
      });
      res.status(200);
    }
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  const { userId, productId, count } = req.body;

  try {
    const cart = await Cart.findOne({ idUser: userId }).lean();
    const listProduct = cart.products;
    const index = listProduct.findIndex(
      (product) => product.idProduct === productId
    );

    listProduct[index].count = count;

    updateCart(userId, listProduct, res);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const { userId, productId } = req.query;
  try {
    const cart = await Cart.findOne({ idUser: userId }).lean();
    const listProduct = cart.products;

    const newProducts = listProduct.filter(
      (product) => product.idProduct !== productId
    );
    updateCart(userId, newProducts, res);
  } catch (err) {
    next(err);
  }
};

// helper
// update cart
const updateCart = (userId, listProduct, res) => {
  Cart.findOneAndUpdate({ idUser: userId }, { products: listProduct }).then(
    () => res.status(200).json({ success: "success" })
  );
};
