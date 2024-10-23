const express = require("express")
const { sendMessage,allMessages } = require("../controllers/messageControllers")
const router = express.Router()
const{protect}=require("../middlewares/authMiddleware.js")

router.post("/",protect,sendMessage)

router.route("/:chatId").get(protect, allMessages);

module.exports = router