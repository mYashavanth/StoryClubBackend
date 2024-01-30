const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const cookieProvider = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const storyRouter = require("./routes/story.routes");

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
app.use("/storys", storyRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the StoryClub Backend Server");
})
app.get("*", (req, res) => {
    res.status(404).send({ msg: "Page not found" });
})

app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server is running on http://localhost:${PORT}`)
})