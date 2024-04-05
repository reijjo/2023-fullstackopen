const express = require("express");
const morgan = require("morgan");

const app = express();

const { PORT } = require("./utils/config");
const { connectDB } = require("./utils/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const readinglistRouter = require("./controllers/readinglists");
const {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
} = require("./utils/middleware");
const { User } = require("./models");
const Sessions = require("./models/session");

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", readinglistRouter);

// Logout route
app.delete("/api/logout", tokenExtractor, async (req, res) => {
  const user = User.findByPk(req.decodedToken.id);
  const session = Sessions.findOne({
    where: { user_id: user.id },
  });

  if (!session) {
    return res.json(404).json({ error: "no such session" });
  }

  await req.session.destroy();
  res.status(200).json({ msg: "logged out" });
});

// Middlewares
app.use(unknownEndpoint);
app.use(errorHandler);

// Server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
  });
};

start();
