const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const PORT = process.env.PORT;
const cookieProvider = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/user.routes");
const storyRouter = require("./routes/story.routes");
const serverRouter = require("./verification/server");
const emailRouter = require("./verification/emailVerification");
const hireRouter = require("./routes/hiring.routes");

// app config
const app = express();

// middleware
app.use(express.json());
app.use(cookieProvider());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// routes
app.use("/user", userRouter);
app.use("/storys", storyRouter);
app.use("/otp", serverRouter);
app.use("/email",emailRouter)
app.use("/hire",hireRouter)

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