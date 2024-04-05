const router = require("express").Router();
const { Op } = require("sequelize");

const { Blog, User } = require("../models");

const { blogFinder, tokenExtractor } = require("../utils/middleware");

// Routes

// api/blogs
// GET
// Get all blogs
router.get("/", async (req, res) => {
  let where = {};

  // req.query from blogs
  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
        {
          author: {
            [Op.iLike]: `%${req.query.search}%`,
          },
        },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

// api/blogs
// POST
// Add new blog
router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);

    console.log("user", user);

    const blog = await Blog.create({
      ...req.body,
      userId: user.id,
      date: new Date(),
    });
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

// api/blogs/:id
// GET
// Find one blog
router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).json({ error: "Blog not found." });
  }
});

// api/blogs/:id
// PUT
// Modify blog
router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      res.status(200).json(req.blog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// api/blogs/:id
// DELETE
// Delete one blog
router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  try {
    if (!req.blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    const user = await User.findByPk(req.decodedToken.id);

    console.log("req.bog", req.blog);
    console.log("user", user);

    if (req.blog.userId === user.id) {
      await req.blog.destroy();

      res.json({ msg: "Blog deleted." });
    } else {
      res.status(404).json({ msg: "Cant delete. That is not your blog" });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
