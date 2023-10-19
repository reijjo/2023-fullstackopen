# 2023-fullstackopen

fullstackopen

# VITE

## Create project

npm create vite@latest [PROJECT NAME] -- --template react
cd [PROJECT NAME]
npm install
npm run dev

### main.jsx

```jsx
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

### App.jsx

```jsx
const App = () => {
  return (
    <div>
      <p>Hello world</p>
    </div>
  );
};

export default App;
```

### remove App.css and index.css files and assets folder

### Add a rule to eslintrc.cjs

```cjs
'react/prop-types': false
```

# OSA 2

## Country API

`https://studies.cs.helsinki.fi/restcountries/`

## Weather API

`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=LAT&lon=LNG&appid=APIKEY`

## How to start project Vite project with API KEY

- `VITE_SOME_KEY=APIKEYYY npm run dev`

- use the api key
  - const api_key = import.meta.env.VITE_SOME_KEY

# OSA 3

## How to backend

### Basic server

- make a folder (for example mkdir server)
- `npm init -y` in that folder
- add to package.json

```json
	"start": "node index.js"
```

on scripts

- make a index.js file to the root of the folder
- make it a web server

```js
const http = require("http");

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify(notes));
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
```

- `npm start` -> http://localhost:3001

That is a basic server. Let's install express which is a easier way to use server on node.js

### Express.js

- `npm install express`
- Change the index.js to

```js
const express = require("express");
const app = express();

app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- install nodemon (nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.) `npm install --save-dev nodemon`
- add to package.json

```json
	...
	"dev": "nodemon index.js"
	...
```

on scripts -> `npm run dev` to start the server

- add a route to index.js to get a specific note

```js
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});
```

- add a route to delete note

```js
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);

  res.status(204).end();
});
```

- add a route to add note

```js
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes/", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  res.json(note);
});
```

## MongoDB

### MongoDB Atlas

- create account `https://www.mongodb.com/atlas/database`
- create Organization and Project
- 'Build a Cluster' -> Create free -> Wait for the cluster to be ready
- create user and allow access for all ip addresses
- connect to your database and copy the MongoDB URI

### Backend with MongoDB

- `npm install mongoose` and then make a file to test MongoDB

```js
const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `[YOUR_MONGODB_URI]`;
// for example `mongodb+srv://fullstack:<password>@cluster0.ki8kl40.mongodb.net/?retryWrites=true&w=majority`
// and change it to this format `mongodb+srv://fullstack:${password}@cluster0.ki8kl40.mongodb.net/?retryWrites=true&w=majority`
// remember to add the database name on your MongoDB URI `...mongodb.net/YOURDATABASENAME?retryWRites...`

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is Easy",
  important: true,
});

note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});
```

- run the test file `node mongo.js [YOURPASSWORD]` in terminal
- in MongoDB Atlas 'Browse Collections' and there should be a note saved
- find notes

```js
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
```

#### for FLY

`fly secrets set MONGODB_URI="mongodb+srv://fullstack:<password>@cluster0.o1opl.mongodb.net/noteApp?retryWrites=true&w=majority"`

### Make proxy so you can use /api/notes and not http://localhost:3001/api/notes

- vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
```

# OSA 4

## Structuring backend

├── index.js
├── app.js
├── build
│ ├── ...
├── controllers
│ └── notes.js
├── models
│ └── note.js
├── package-lock.json
├── package.json
├── utils
│ ├── logger.js
│ ├── config.js
│ └── middleware.js

- utils/logger.js

```js
const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
```

- index.js

```js
const app = require("./app"); // varsinainen Express-sovellus
const config = require("./utils/config");
const logger = require("./utils/logger");

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
```

- utils/config.js

```js
require("dotenv").config();

let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
};
```

- controllers/notes.js

```js
const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.post("/", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
```

- app.js

```js
const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
```

- utils/middleware.js

```js
const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
```

- models/note.js

```js
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
```

## Jest

- `npm install --save-dev jest`

## Different environment for testing

### .env file (this is for mongoDB)

- make different database for testing so it doesn't mess everything up

```
MONGODB_URI=mongodb+srv://.../noteApp?retryWrites=true&w=majority
TEST_MONGODB_URI=mongodb+srv://.../testNoteApp?retryWrites=true&w=majority
```

### package.json

- on scripts

```json
	"dev": "NODE_ENV=develpment nodemon index.js",
	"test": "NODE_ENV=test jest --verbose"
```

- end of the file

```json
	"jest": {
		"testEnvironment": "node"
	}
```

### first tests

- make utils/for_testing.js file

```js
const reverse = (string) => {
  return string.split("").reverse().join("");
};

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item;
  };
  return array.reduce(reducer, 0) / array.length;
};

module.exports = {
  reverse,
  average,
};
```

- make tests/reverse.test.js file

```js
const reverse = require("../utils/for_testing").reverse;

test("reverse of a", () => {
  const result = reverse("a");

  expect(result).toBe("a");
});

test("reverse of react", () => {
  const result = reverse("react");

  expect(result).toBe("tkaer");
});

test("reverse of saippuakauppias", () => {
  const result = reverse("saippuakauppias");

  expect(result).toBe("saippuakauppias");
});
```

- run test `npm run test`

- make tests/average.test.js file

```js
const average = require("../utils/for_testing").average;

describe("average", () => {
  test("of one value is the value itself", () => {
    expect(average([1])).toBe(1);
  });

  test("of many is calculated right", () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });

  test("of empty array is zero", () => {
    expect(average([])).toBe(0);
  });
});
```

- run only one test or describe block `npm test -- -t '[BLOG / DESCRIBE NAME]}'`
- or just

```js
test.only("of empty array is zero", () => {
  expect(average([])).toBe(0);
});
```

## IMPORTANTE! (supertest)

- https://github.com/ladjs/supertest
- `npm install --save-dev supertest`
- example file tests/note_api.test.js

```js
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Note = require("../models/note");

const initialNotes = [
  {
    content: "HTML is easy",
    important: false,
  },
  {
    content: "Browser can execute only JavaScript",
    important: true,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialNotes);
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
});
```

## If there is an error while testing

- make teardown.js file to tests folder

```js
module.exports = () => {
  process.exit(0);
};
```

- add to package.json

```json
  "jest": {
    "testEnvironment": "node",
    "globalTeardown": "./tests/teardown.js"
  }
```

## Run single tests

- with filename `npm test -- tests/note_api.test.js`
- with test/describe name `npm test -- -t 'MY TEST'`
- with part of the name/describe `npm test -- --t 'MY't

## No more try-catch

- https://github.com/davidbanham/express-async-errors
- `npm install express-async-errors` and then in app.js

```js
require("express-async-errors");
```

## JsonWebToken

- `npm install jsonwebtoken`
- controllers/login.js file

```js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
```

- add token authorization to controllers/notes.js

```js
// Token authorization

const getTokenFrom = (req) => {
  const authorization = req.get("authorization");
  console.log("Authorizaition", authorization);
  if (authorization && authorization.startsWith("bearer ")) {
    const done = authorization.replace("bearer ", "");
    console.log("DONE", done);
    return done;
  }
  return null;
};
// ...
notesRouter.post("/", async (request, response, next) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  console.log("user", user);

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedNote);
});
```

- add expiration time for token in controllers/login.js

```js
// ...
const token = jwt.sign(userForToken, process.env.SECRET, {
  expiresIn: 60 * 60,
});
```
