const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

// Delete old blogs from BLOGTEST database and add new ones

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test("blogs are returned as json", async () => {
  await api.get("/api/blogs").expect("Content-Type", /application\/json/);
});

// Close the connection to BLOGTEST database

afterAll(async () => {
  await mongoose.connection.close();
});
