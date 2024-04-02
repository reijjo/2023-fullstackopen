const express = require("express");
const morgan = require("morgan");

const app = express();

const { PORT } = require("./utils/config");
const { connectDB } = require("./utils/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const { unknownEndpoint, errorHandler } = require("./utils/middleware");

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

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
