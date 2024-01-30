const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const cookieProvider = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user.routes");

// app config
const app = express();

// middleware
app.use(express.json());
app.use(cookieProvider());
app.use(cors( {
    origin: `http://localhost:${PORT}`,
    credentials: true
} ));

// routes
app.use("/user", userRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the StoryClub Backend Server");
})

app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`)
})