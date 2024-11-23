const express = require("express")
const { sendMessage,allMessages, deleteMsg } = require("../controllers/messageControllers")
const router = express.Router()
const{protect}=require("../middlewares/authMiddleware.js")

router.post("/",protect,sendMessage)

router.route("/:chatId").get(protect, allMessages);

router.delete("/:msgId",protect,deleteMsg)

module.exports = router