const asyncHandler = require("express-async-handler")

const Chat = require("../models/chatModel");
const User = require("../models/userModel.js")
const Message = require("../models/messageModel.js");

module.exports.sendMessage = asyncHandler(async(req,res)=>{
    const{content,chat}=req.body

    if(!content || !chat){
        console.log("Invlid data sent to the request");
        return res.sendStatus(400)
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chat
    }

    try {
        var message = await Message.create(newMessage)
        message = await message.populate("sender","name pic")
        message = await message.populate("chat")
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })
        await Chat.findByIdAndUpdate(req.body.chat,{
            latestMessage:message
        })
        res.json(message)
    } catch (error) {
        console.error("Error sending message:", error.message);
        res.sendStatus(400).json({message:error.message || 'Failed to send message'})
        
    }
})

module.exports.allMessages = asyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
    
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });