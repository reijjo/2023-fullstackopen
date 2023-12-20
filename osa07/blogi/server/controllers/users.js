const bcrypt = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/user");

// api/users

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: "no empty fields, thanks" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
    name,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error:
          "Username is under 3 characters long or username is already taken.",
      });
    }
    return res.status(500).json({ error: "Error on the server side" });
  }
});

// api/users/:id

usersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.json(user);
});

module.exports = usersRouter;
