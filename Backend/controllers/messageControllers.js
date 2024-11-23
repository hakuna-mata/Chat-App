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
        // console.log(message);
        
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

  module.exports.deleteMsg = asyncHandler(async (req, res) => {
    try {
      const { msgId } = req.params;
  
      //Delete the message
      const deletedMessage = await Message.findByIdAndDelete(msgId)
        .populate("sender", "name pic email")
        .populate("chat");
  
      if (!deletedMessage) {
        return res.status(404).json({ message: "Message not found!" });
      }
  
      const chatId = deletedMessage.chat._id;
  
      // Find the most recent message in the same chat
      const latestMessage = await Message.find({ chat: chatId })
        .sort({ createdAt: -1 }) // Sort messages by creation time in descending order
        .limit(1) // Get the most recent message
        .populate("sender", "name pic email");
  
      // Update the latestMessage field in the chat
      await Chat.findByIdAndUpdate(chatId, {
        latestMessage: latestMessage.length > 0 ? latestMessage[0]._id : null, // Set to null if no messages remain
      });
  
      res.status(200).json({ message: "Message deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete the message!" });
    }
  });
  