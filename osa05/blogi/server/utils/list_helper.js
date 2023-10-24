const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const result = blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  );
  return {
    title: result.title,
    author: result.author,
    likes: result.likes,
  };
};

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, "author");
  const mostBlogs = _.maxBy(
    _.keys(authorCounts),
    (author) => authorCounts[author]
  );

  return {
    author: mostBlogs,
    blogs: authorCounts[mostBlogs],
  };
};

const mostLikes = (blogs) => {
  const authorLikes = _.groupBy(blogs, "author");
  const authorsWithLikes = _.map(authorLikes, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, "likes"),
  }));

  const mostLikesAuthor = _.maxBy(authorsWithLikes, "likes");

  return mostLikesAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
