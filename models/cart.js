const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  idUser: {
    type: String,
    required: true,
    ref: "User",
  },
  products: [
    {
      idProduct: {
        type: String,
        required: true,
        ref: "Product",
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", cartSchema);
