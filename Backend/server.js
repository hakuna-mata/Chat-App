require("dotenv").config();
const express = require("express");
const cors = require("cors");
const main = require("../Backend/config/db");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js")
const messageRoutes = require("./routes/messageRoutes.js")
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
const path = require("path")


const app = express();

const __dirname1 = path.dirname(require.main.filename);


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
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)

if (process.env.NODE_ENV === "production") {
    const staticPath = path.join(__dirname, "../Frontend/dist");
    // console.log("Serving static files from:", staticPath);

    app.use(express.static(staticPath));

    app.get("*", (req, res) => {
        const indexPath = path.resolve(staticPath, "index.html");
        console.log("Serving index.html for:", req.url);
        res.sendFile(indexPath);
    });
} else {
    app.get("/", (req, res) => {
        res.send("API Running successfully");
    });
}


// Custom error handling middleware
app.use(notFound);
app.use(errorHandler);

// console.log("Static files served from:", path.join(__dirname1, "Frontend/dist"));
// console.log("Index.html path:", path.resolve(__dirname1, "Frontend", "dist", "index.html"));






console.log("Serving static files from:", path.join(__dirname, "../Frontend/dist"));


let server = app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`);
});

const io = require("socket.io")(server, {
    pingTimeout: 8000,
    cors: {
        origin: "http://localhost:5173"
    }
})

app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});


const activeUsers = new Set();

io.on("connection", (socket) => {
    // console.log(socket)
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id); // User joins their own room
        console.log("User room on setup:", userData._id);
        socket.emit("connected");

        // Add user to active users
        socket.userId = userData._id;  // Store userID on the socket object
        activeUsers.add(userData._id);
        console.log(activeUsers);

        io.emit("active users", Array.from(activeUsers));
        // socket.emit("connected");
    });



    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined chat room:", room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))
    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat
        if (!chat.users) return console.log("Users,chat not defined");

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received", newMessageReceived)
        });
    })


    socket.on("disconnect", () => {
        // Check if the socket has a userId stored
        if (socket.userId) {
            activeUsers.delete(socket.userId);  // Remove the user from activeUsers
            io.emit("active users", Array.from(activeUsers));
            console.log("User disconnected:", socket.userId);
            console.log("Active users after disconnect:", Array.from(activeUsers));
        }
    });
});
