const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: "Empty user",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    res.status(200).send({ token, username: user.username, name: user.name });
  } catch (error) {
    console.error("Error in loginRouter:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = loginRouter;
