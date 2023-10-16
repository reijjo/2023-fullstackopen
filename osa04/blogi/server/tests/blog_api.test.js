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
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("Blog ID is id NOT _id", async () => {
  const blogs = await helper.blogsInDb();

  blogs.map((blog) => {
    expect(blog.id).toBeDefined();
    expect(blog._id).not.toBeDefined();
  });
});

test("You can add a blog?", async () => {
  const newBlog = {
    title: "Uutta materiaalia",
    author: "REpe",
    url: "www.reijjo.info",
    likes: 1000,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const authors = blogsAtEnd.map((a) => a.author);
  expect(authors).toContain("REpe");
  expect(authors).not.toContain("Repe");
});

test("New blog without likes = 0", async () => {
  const newBlog = {
    title: "Uutta materiaalia",
    author: "REpe",
    url: "www.reijjo.info",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];
  expect(lastBlog.author).toContain("REpe");
  expect(lastBlog.likes).toBe(0);
});

test("New blogs without title / url are bad!", async () => {
  const blogNoTitle = {
    author: "Joku luuseri",
    url: "www.kiss.fi",
    likes: 400,
  };

  await api.post("/api/blogs").send(blogNoTitle).expect(400);

  const blogNoUrl = {
    title: "Elämä on lahja",
    author: "Joku luuseri",
    likes: 400,
  };

  await api.post("/api/blogs").send(blogNoUrl).expect(400);

  const newBlog = {
    title: "Uutta materiaalia",
    author: "REpe",
    url: "www.reijjo.info",
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
});

test("deletion of a blog", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

  const blogsAtEnd = await helper.blogsInDb();

  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

  const contents = blogsAtEnd.map((r) => r.title);

  expect(contents).not.toContain(blogToDelete.content);
});

test("Updating a blog", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToUpdate = blogsAtStart[0];

  console.log("blotto", blogToUpdate.id);

  expect(blogToUpdate.title).toContain("React patterns");

  const updatedBlog = {
    title: "Ei oo reactii enaa",
    author: "Sepi Kumpulainen",
    url: "laulavatalonmies.fi",
    likes: 1001,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200);

  const blogsAtEnd = await helper.blogsInDb();

  const contents = blogsAtEnd.map((t) => t.title);

  expect(contents).not.toContain("React patterns");
});

// Close the connection to BLOGTEST database

afterAll(async () => {
  await mongoose.connection.close();
});
