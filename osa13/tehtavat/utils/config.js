require("dotenv").config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
};
