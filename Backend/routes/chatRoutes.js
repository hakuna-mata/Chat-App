const express = require("express")
const { protect } = require("../middlewares/authMiddleware")
const router = express.Router()
const{accessChat, fetchChats, createGroupChat, renameGroup, addToGroup,removeFromGroup}=require("../controllers/chatControllers")

// router.post("/",protect,accessChat)

router.route("/").get(protect,fetchChats).post(protect,accessChat)

router.route("/group").post(protect,createGroupChat)

router.route("/rename").put(protect,renameGroup)

router.route("/groupAdd").put(protect,addToGroup)

router.route("/groupRemove").put(protect,removeFromGroup)

module.exports=router
