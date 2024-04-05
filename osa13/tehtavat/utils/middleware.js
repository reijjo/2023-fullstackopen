const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");
const { Blog } = require("../models");

// Finding one blog
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

// 404 - Not Found!
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "404 - Not Found." });
};

// Error handler
const errorHandler = (err, req, res, next) => {
  console.error("ERROR HANDLER TOIMIIIII", err);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({ error: err.errors[0].message });
  }

  if (err.name === "SequelizeDatabaseError") {
    return res
      .status(400)
      .json({ error: `Invalid input '${err.parent.parameters[0]}'` });
  }

  next(err);
};

// Middleware for token
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { blogFinder, errorHandler, unknownEndpoint, tokenExtractor };
