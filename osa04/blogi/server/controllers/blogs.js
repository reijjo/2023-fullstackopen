const blogRouter = require("express").Router();
const Blog = require("../models/blog");

// blogs/api

blogRouter.get("/", (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

blogRouter.post("/", (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
  });
  // console.log("blog content", blog);

  if (!blog.title || !blog.url) {
    return response.status(400).end();
  } else {
    blog.save().then((result) => {
      response.status(201).json(result);
    });
  }

  // blogs/api/:id

  blogRouter.delete("/:id", async (req, res, next) => {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  });

  blogRouter.put("/:id", async (req, res, next) => {
    const body = req.body;

    console.log("REQBODY", req.body);

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    };

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true,
    });
    res.json(updatedBlog);
  });
});

module.exports = blogRouter;
