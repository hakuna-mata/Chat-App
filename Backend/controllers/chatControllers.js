const Chat = require("../models/chatModel.js")
const asyncHandler = require("express-async-handler")
const User = require("../models/userModel.js")

module.exports.accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId not sent with params");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        users: { $all: [req.user._id, userId] } //  $all to match both user IDs
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };
        try {
            const createdChat = await Chat.create(chatData);

            
            const FullChat = await Chat.findOne({ _id: createdChat._id })
                .populate("users", "-password");
              
            res.status(200).send(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

module.exports.fetchChats = asyncHandler(async (req, res) => {
    try {
        //  $in to check if req.user._id exists in the users array
        const results = await Chat.find({ users: { $in: [req.user._id] } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });      //Sort the chats by recently updated

        const populatedResults = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email"
        });

        res.status(200).send(populatedResults);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports.createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }

    var users = JSON.parse(req.body.users)

    if (users.length < 2) {
        return res.status(400).send("More than 2 users are required to form a group chat")
    }

    users.push(req.user)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        res.status(200).json(fullGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports.renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
});

module.exports.addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId }
    }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!added) {
        res.status(400)
        throw new Error("Chat not found")
    } else {
        res.json(added)
    }
})

module.exports.removeFromGroup = asyncHandler(async(req,res)=>{
    const{chatId,userId}=req.body
    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{new:true})
    .populate("users","-password")
    .populate("groupAdmin","-password")

    if(!removed){
        res.status(400)
        throw new Error("Chat not found")
    }else{
        res.json(removed)
    }
})