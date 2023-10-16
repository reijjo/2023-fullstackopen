const blogRouter = require("express").Router();
const Blog = require("../models/blog");

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
});

module.exports = blogRouter;
