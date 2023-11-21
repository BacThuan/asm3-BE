const ChatSession = require("../models/chat");
const io = require("../socket");
exports.getChatUser = async (req, res, next) => {
  const chatSession = req.query.chatSession;
  try {
    const chat = await ChatSession.findById(chatSession);
    if (chat) getChat(res, chat, "chatsUser");
  } catch (err) {
    next(err);
  }
};

exports.getChatAdmin = async (req, res, next) => {
  try {
    const allChat = await ChatSession.find();
    const usersInfo = await Promise.all(
      allChat.map((chat) => {
        return { _id: chat._id, idUser: chat.idUser };
      })
    );
    res.status(200).json(usersInfo);
  } catch (err) {
    next(err);
  }
};

exports.adminChat = async (req, res, next) => {
  const newMess = { messType: "admin", mess: req.body.mess };
  try {
    const chat = await ChatSession.findById(req.body.chatId);
    if (chat) {
      // end chat
      if (req.body.mess === "/end") {
        deleteChat(res, chat._id);
      } else addChat(res, chat, chat._id, newMess);
    }
  } catch (err) {
    next(err);
  }
};

exports.getSingleChat = async (req, res, next) => {
  try {
    const chatId = req.query.chatSession;
    const chat = await ChatSession.findById(chatId);
    getChat(res, chat, "chatsAdmin");
  } catch (err) {
    next(err);
  }
};

exports.userChat = async (req, res, next) => {
  const newMess = { messType: "customer", mess: req.body.mess };

  try {
    // had a chat session
    if (req.body.chatSession) {
      const chat = await ChatSession.findById(req.body.chatSession);

      if (chat) {
        // end chat
        if (req.body.mess === "/end") {
          deleteChat(res, chat._id);
        } else addChat(res, chat, chat._id, newMess);
      }
      // cant find chat
      else createNewChat(req, res, newMess);
    }

    // create new chat
    else createNewChat(req, res, newMess);
  } catch (err) {
    next(err);
  }
};

// helper

// get chat
const getChat = async (res, chat, chatType) => {
  io.getIO().emit(chatType, {
    action: "get",
    chat: chat,
  });

  res.status(201).json("Chat got successfully!");
};

// create chat
const createNewChat = async (req, res, newMess) => {
  const newChat = await ChatSession.create({
    idUser: req.session.user ? req.session.user._id : "Stranger",
    content: newMess,
  });

  io.getIO().emit("chatsUser", {
    action: "create",
    chatSession: newChat._id,
    mess: newMess,
  });

  io.getIO().emit("chatsAdmin", {
    action: "create",
  });

  res.status(201).json("Chat created successfully!");
};

// add chat
const addChat = async (res, chat, chatId, newMess) => {
  chat.content.push(newMess);

  // update
  await ChatSession.findByIdAndUpdate(chatId, {
    content: chat.content,
  });

  io.getIO().emit("chatsUser", {
    action: "add",
    mess: newMess,
    chatId: chatId,
  });
  io.getIO().emit("chatsAdmin", {
    action: "add",
    mess: newMess,
    chatId: chatId,
  });

  res.status(201).json("Success!");
};

// delete chat
const deleteChat = async (res, chatId) => {
  // delete
  await ChatSession.findByIdAndDelete(chatId);

  io.getIO().emit("chatsUser", {
    action: "delete",
    chatId: chatId,
  });
  io.getIO().emit("chatsAdmin", {
    action: "delete",
  });

  res.status(201).json("Success!");
};
