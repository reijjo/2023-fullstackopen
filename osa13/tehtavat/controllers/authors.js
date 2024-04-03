const router = require("express").Router();
const { Blog } = require("../models");
const { sequelize } = require("../utils/db");

// ROUTES

// api/authors
// GET
// Get authors
router.get("/", async (req, res) => {
  const authors = await Blog.findAll({
    group: "author",
    attributes: [
      "author",
      [sequelize.fn("COUNT", sequelize.col("author")), "articles"],
      [sequelize.fn("SUM", sequelize.col("likes")), "likes"],
    ],
    order: sequelize.literal("MAX(likes) DESC"),
  });
  res.json(authors);
});

module.exports = router;
