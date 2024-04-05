const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readinglists");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.belongsToMany(User, { through: ReadingList, as: "readinglist" });
User.belongsToMany(Blog, { through: ReadingList, as: "readings" });

// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = {
  Blog,
  User,
  ReadingList,
};
