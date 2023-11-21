const nodemailer = require("nodemailer");
const Order = require("../models/order");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.detailOrder = async (req, res, next) => {
  const orderId = req.query.orderId;

  try {
    const order = await Order.findOne({ _id: orderId }).lean();

    const products = await Promise.all(
      order.products.map(async (product) => {
        const productInfo = await Product.findById(product.idProduct);
        return { product: productInfo, count: product.count };
      })
    );

    res.json({ order: order, products: products });
  } catch (err) {
    next(err);
  }
};

exports.count = async (req, res, next) => {
  try {
    const count = await Order.countDocuments();

    res.json(count);
  } catch (err) {
    next(err);
  }
};

exports.total = async (req, res, next) => {
  try {
    const orders = await Order.find();

    const allPrice = await Promise.all(
      orders.map((order) => {
        const total = order.total;

        const numericString = total.replace(/[^\d]/g, "");
        return Number(numericString);
      })
    );
    let sum = allPrice.reduce(function (a, b) {
      return a + b;
    }, 0);

    res.json(sum);
  } catch (err) {
    next(err);
  }
};

exports.histories = async (req, res, next) => {
  try {
    // for admin
    if (req.query.admin) {
      const orders = await Order.find().lean();
      let result = [];

      orders.forEach((order) => {
        let data = {
          _id: order._id,
          idUser: order.idUser,
          name: order.orderInfo.name,
          phone: order.orderInfo.phone,
          address: order.orderInfo.address,
          total: order.total,
          delivery: order.delivery,
          status: order.status,
        };

        result.push(data);
      });

      result.reverse();

      if (req.query.limit) {
        result.splice(8);
      }

      res.status(200).json(result);
    }
    //
    else {
      const idUser = req.query.userId;
      const order = await Order.find({ idUser: idUser });
      res.json(order);
    }
  } catch (err) {
    next(err);
  }
};

exports.placeOrder = async (req, res, next) => {
  const userId = req.body.userId;
  const total = req.body.total;
  const orderInfo = req.body.orderInfo;

  try {
    const cart = await Cart.findOne({ idUser: userId }).lean();
    const products = await Promise.all(
      cart.products.map(async (product) => {
        const productInfo = await Product.findById(product.idProduct);

        return { product: productInfo, count: product.count };
      })
    );

    const newOrder = {
      idUser: userId,
      orderInfo: orderInfo,
      products: cart.products,
      total: total + " VND",
      delivery: "Waiting for progressing",
      status: "Waiting for pay",
    };

    await Order.create(newOrder);

    // clear cart
    await Cart.findOneAndDelete({ idUser: userId });
    res.status(200).json("OK");

    createEmail(orderInfo, products, total);
  } catch (err) {
    next(err);
  }
};

// helper

// chuyen string thanh so
const convert = (price) => {
  return (price =
    typeof price === "string"
      ? price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : price);
};
// create email
const trans = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cenation7979@gmail.com",
    pass: "imab dyyr hlib bdyp",
  },
});

// send email
const createEmail = (info, products, total) => {
  function html() {
    return `
      <div className="table-responsive mb-4">
        <h2>Dear ${info.name}</h2>
        <p>Phone: ${info.phone}</p>
        <p>Address: ${info.address}</p>
        <table className="table">
          <thead className="bg-light">
            <tr className="text-center">
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Product</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Image</strong>
              </th>

              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Price</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Quantity</strong>
              </th>
              <th className="border-0" scope="col">
                <strong className="text-small text-uppercase">Amount</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            ${products.map(
              (product, index) =>
                `<tr className="text-center" key={index}>
                <td className="align-middle border-0">
                  <div className="media align-items-center justify-content-center">
                    ${product.product.name}
                  </div>
                </td>
                <td className="pl-0 border-0">
                  <div className="media align-items-center justify-content-center">
                    <img src=${product.product.img[0]} alt="..." width="70" />
                  </div>
                </td>

                <td className="align-middle border-0">
                  <p className="mb-0 small">${convert(
                    String(product.product.price)
                  )} VND</p>
                </td>
                <td className="align-middle border-0">
                <p className="mb-0 small">${product.count}</p>
                </td>
                <td className="align-middle border-0">
                  <p className="mb-0 small">
                    ${convert(
                      String(
                        parseInt(product.product.price) *
                          parseInt(product.count)
                      )
                    )} VND
                  </p>
                </td>
              </tr>`
            )}
            <h2>Total ${total}</h2>
            <h2>Thank you very much!</h2>
          </tbody>
        </table>
      </div>`;
  }

  trans.sendMail(
    {
      from: "cenation7979@gmail.com",
      to: info.email,
      subject: "Confirm order",
      html: html(),
    },
    function (err, info) {
      if (err) console.log(err);
      else {
        console.log(info.response);
      }
    }
  );
};
