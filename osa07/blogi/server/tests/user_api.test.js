const supertest = require("supertest");
const mongoose = require("mongoose");

const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);

const User = require("../models/user");

describe("4d, Creating a user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("Adding a valid user", async () => {
    const user = {
      username: "repe",
      password: "salainen",
      name: "repe laine",
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(1);
  });

  test("Too short username", async () => {
    await User.insertMany(helper.oneUser);

    const usersAtStart = await helper.usersInDb();

    console.log("usersat start", usersAtStart.length);

    expect(usersAtStart).toHaveLength(1);

    const user = {
      username: "pe",
      password: "salainen",
      name: "repe laine",
    };

    await api.post("/api/users").send(user).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(1);
  });

  test("Empty password", async () => {
    await User.insertMany(helper.oneUser);

    const user = {
      username: "pe",
      password: "",
      name: "repe laine",
    };

    await api.post("/api/users").send(user).expect(400);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(1);
  });

  test("Username already taken", async () => {
    await User.insertMany(helper.oneUser);

    const user = {
      username: "repe",
      password: "salainen",
      name: "repe laine",
    };

    await api.post("/api/users").send(user).expect(400);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
