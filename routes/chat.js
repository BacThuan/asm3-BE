const { Router } = require("express");

const chatController = require("../controllers/chat");
const chatRouter = Router();

chatRouter.get("/chats/user", chatController.getChatUser);
chatRouter.post("/chats/user", chatController.userChat);
chatRouter.get("/chats/admin", chatController.getChatAdmin);
chatRouter.post("/chats/admin", chatController.adminChat);
chatRouter.get("/chats/adminChat", chatController.getSingleChat);

module.exports = chatRouter;
