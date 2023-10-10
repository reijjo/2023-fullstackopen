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
