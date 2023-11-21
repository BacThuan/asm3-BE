const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  idUser: {
    type: String,
  },
  content: [
    {
      messType: {
        type: String, //  admin/user
      },
      mess: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("ChatSession", chatSchema);
