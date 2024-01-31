const express = require("express");
const auth = require("../middlewares/auth.middleware");
const storyRouter = express.Router();

storyRouter.use(auth);

storyRouter.get("/", (req, res) => {
    res.send("Welcome to the StoryClub Storys Page");
})

module.exports = storyRouter