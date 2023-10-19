const logger = require("./logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: "token missing or invalid" });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.startsWith("bearer ")) {
    req.token = authorization.replace("bearer ", "");
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: "token invalid " });
    } else {
      req.user = await User.findById(decodedToken.id);
      next();
    }
  } catch (error) {
    return res.status(401).json({ error: "Old or invalid token." });
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
