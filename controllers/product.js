const Product = require("../models/product");

exports.find = async (req, res, next) => {
  const product = await Product.find();

  product.reverse();
  let result;

  // for admin
  if (req.query.admin) {
    result = await Promise.all(
      product.map((pro, index) => {
        return {
          _id: pro._id,
          name: pro.name,
          price: pro.price,
          img: pro.img[0],
          category: pro.category,
        };
      })
    );
  }

  // fill category
  if (req.query.category && req.query.page) {
    let category = req.query.category;
    if (category !== "all") {
      result = product.filter((product) => product.category === category);
    }
    //
    else result = product;

    // fill page
    let page = req.query.page - 1;
    result = result.slice(page * 8, 8);
  }

  if (req.query.max) {
    result = product.slice(0, 8);
  }

  res.status(200).json(result);
};

exports.getEdit = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const product = await Product.findById(productId);

    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.add = async (req, res, next) => {
  try {
    await Product.create(req.body);
    res.status(200).json("Success");
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json("Success");
  } catch (err) {
    next(err);
  }
};

exports.details = async (req, res, next) => {
  const id = req.query.id;
  try {
    const product = await Product.findOne({ _id: id }).lean();

    // find related in remove the detail
    let related = await Product.find({
      category: product.category,
    });

    related.reverse();
    related = related.filter(
      (pro) => pro._id.toString() !== product._id.toString()
    );

    // take only 8 related
    related = related.slice(0, 8);

    res.json({ product: product, related: related });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json("Product has been deleted.");
  } catch (err) {
    next(err);
  }
};
