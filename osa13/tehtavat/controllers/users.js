const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

// ROUTES

// api/users
// GET
// Get all users
router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

// api/users
// POST
// Create new user
router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    // return res.status(400).json({ error });
    next(error);
  }
});

// api/users/:id
// GET
// Find one user
router.get("/:id", async (req, res) => {
  let where = {};

  if (req.query.read) {
    where.read = req.query.read;
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: {
          model: ReadingList,
          as: "readinglists",
          attributes: ["read", "id"],
          where,
        },
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ error: "No such user." });
  }

  return res.status(200).json(user);
});

// api/users/:username
// PUT
// Change username
router.put("/:username", async (req, res) => {
  console.log("req params", req.params);
  const user = await User.findOne({
    where: { username: req.params.username },
  });

  console.log('USER",', user.toJSON());
  if (!user) {
    return res.status(404).json({ msg: "username not found" });
  }

  try {
    user.username = req.body.username;
    await user.save();
    return res.status(200).json({ updated: user });
  } catch (error) {
    console.log("update error", error);
    return res.status(404).json({ error });
  }
});

module.exports = router;
