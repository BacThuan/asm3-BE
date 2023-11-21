const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  idUser: {
    type: String,
    required: true,
    ref: "User",
  },
  orderInfo: {
    name: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },

  products: [
    {
      idProduct: {
        type: String,
        required: true,
        ref: "User",
      },
      count: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: String,
    required: true,
  },
  delivery: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
