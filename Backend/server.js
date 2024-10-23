const express = require("express");
require("dotenv").config();
const cors = require("cors");
const main = require("../Backend/config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js")
const messageRoutes = require("./routes/messageRoutes.js")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");

const app = express();

// Initialize the database
main();

//CORS for specific origin
app.use(cors({
    origin: 'http://localhost:5173' 
}));

// Enable parsing of JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", userRoutes);
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)

// Custom error handling middleware
app.use(notFound);
app.use(errorHandler);


let server = app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`.yellow.bold);
});

const io = require("socket.io")(server,{
    pingTimeout:8000,
    cors:{
        origin:"http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    // console.log(socket)
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id); // User joins their own room
        console.log("User room (on setup):", userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined chat room:", room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"))
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"))
    socket.on("new message",(newMessageReceived)=>{
        var chat = newMessageReceived.chat
        if(!chat.users) return console.log("Users,chat not defined");
        
        chat.users.forEach((user)=>{
            if(user._id===newMessageReceived.sender._id)return;
            socket.in(user._id).emit("message received",newMessageReceived)
        });
    })

    socket.off("setup",()=>{
        console.log("User Disconnected");
        socket.leave(userData._id)
    })
});
