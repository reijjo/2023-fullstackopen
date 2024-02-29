const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const start = (url) => {
  console.log("connecting to MongoDB...");
  mongoose
    .connect(url)
    .then(() => {
      console.log("connected to MongoDB!");
    })
    .catch((error) => {
      console.log("error connecting to MongoDB", error.message);
    });
};

module.exports = start;
