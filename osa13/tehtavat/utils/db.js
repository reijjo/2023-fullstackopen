const Sequelize = require("sequelize");

const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to Database.");
  } catch (error) {
    console.log("Failed to connect to Database ._.");
    process.exit(1);
  }

  return null;
};

module.exports = { connectDB, sequelize };
