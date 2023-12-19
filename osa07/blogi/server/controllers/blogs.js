const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");
const User = require("../models/user");
const { userExtractor } = require("../utils/middleware");

// blogs/api

blogRouter.get("/", async (request, response, next) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;

  try {
    const user = request.user;

    const blog = new Blog({
      title: title,
      author: author,
      url: url,
      likes: likes || 0,
      user: user._id,
    });

    if (!blog.title || !blog.url) {
      return response.status(400).end();
    } else {
      const savedBlog = await blog.save();
      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      await savedBlog.populate("user");

      response.status(201).json(savedBlog);
    }
  } catch (error) {
    console.error("Error with token", error);
    response.status(401).json({ error: "Token invalid" });
  }
});

// blogs/api/:id

blogRouter.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const userid = req.user;
    const blog = await Blog.findById(req.params.id);

    console.log("blog", blog, "userid", userid, "blog user", blog.user);

    if (blog.user.toString() === userid._id.toString()) {
      await Blog.findByIdAndRemove(req.params.id);
      res.status(204).json({ message: "Blog deleted" });
    } else {
      return res.status(401).json({ error: "You can't remove this blog." });
    }
  } catch (error) {
    console.error("You are not the blog creator", error);
    res.status(401).json({ error: "You are not the creator of the blog" });
  }
});

blogRouter.put("/:id", async (req, res, next) => {
  const body = req.body;
  console.log("BACK BODY", body);

  const blog = {
    ...body,
    user: body.user.id,
    likes: body.likes + 1,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
  });
  res.json(updatedBlog);
});

module.exports = blogRouter;
