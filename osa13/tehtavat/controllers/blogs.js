const router = require("express").Router();

const { Blog } = require("../models");

const { blogFinder, errorHandler } = require("../utils/middleware");

// Routes

// api/blogs
// GET
// Get all blogs
router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();

  console.log(
    "blogs",
    blogs.map((b) => b.toJSON())
  );

  res.json(blogs);
});

// api/blogs
// POST
// Add new blog
router.post("/", async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
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
router.delete("/:id", blogFinder, async (req, res) => {
  try {
    if (!req.blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    await req.blog.destroy();

    res.json({ msg: "Blog deleted." });
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
