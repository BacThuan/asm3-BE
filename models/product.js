const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  img: [String],

  long_desc: {
    type: String,
    required: true,
  },
  short_desc: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  price: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
