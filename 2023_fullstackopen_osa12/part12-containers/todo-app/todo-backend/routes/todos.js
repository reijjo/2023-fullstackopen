const express = require("express");
const { Todo } = require("../mongo");
const { setAsync, getAsync } = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });

  let added = await getAsync("added_todos");
  if (!parseInt(added)) {
    await setAsync("added_todos", 0);
    console.log("added", parseInt(added));
  }

  await setAsync("added_todos", parseInt(added) + 1);

  res.send(todo);
});

// REDISSSS
router.get("/statistics", async (req, res) => {
  let added = await getAsync("added_todos");
  if (!parseInt(added)) {
    await setAsync("added_todos", 0);
    console.log("added", parseInt(added));
  }

  res.json({ added_todos: parseInt(added) });
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  if (req.todo) {
    res.status(200).json(req.todo);
  } else {
    res.sendStatus(405); // Implement this
  }
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const { text, done } = req.body;

  if (!text || !done || !req.todo) {
    res.sendStatus(405); // Implement this
  } else {
    req.todo.text = text;
    req.todo.done = done;

    await req.todo.save();

    res.status(200).json(req.todo);
  }
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
