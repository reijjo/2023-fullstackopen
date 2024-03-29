# Postgres with Docker

- Download image `docker pull postgres`
- Start image `docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres`
- Check your Docker image `docker ps`
- Use docker exec to get in the container `docker exec -it [CONTAINER ID] psql -U postgres postgres`

## Commands

- Main command `\d`
- Create table for notes

```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  content text NOT NULL,
  important boolean,
  date time
);
```

- Command `\d` shows what tables are in the database and `\d notes` shows how the `notes` table is defined
- Add some content to the table

```sql
insert into notes (content, important) values ('Relational databases rule the world', true);
insert into notes (content, important) values ('MongoDB is webscale', false);
```

- `SELECT * FROM notes` to see what created content looks like
- Data that is not according to the schema, will not succeed

```sql
postgres=# insert into notes (important) values (true);
ERROR: null value in column "content" of relation "notes" violates not-null constraint
DETAIL: Failing row contains (9, null, t, null).
```

- Columns that don't exist in the schema are not accepted either

```sql
postgres=# insert into notes (content, important, value) values ('only valid data can be saved', true, 10);
ERROR: column "value" of relation "notes" does not exist
LINE 1: insert into notes (content, important, value) values ('only ...
```

## Node application using a relational database

- `mkdir [PROJECT NAME] && cd [PROJECT NAME] && npm init -y`
- Install nodemon `npm install nodemon --save-dev` and add `"dev": "NODE_ENV=dev nodemon index.js",` to package.json scripts
- Install more dependencies `npm install express dotenv pg sequelize`
- Create `index.js` file:

```js
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
```

- Make `.env` file and add this: `DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres`
- Test connection `npm run dev`
- If it works, we make first query. Modify `index.js`:

```js
require("dotenv").config();

const { Sequelize, QueryTypes } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const main = async () => {
  try {
    await sequelize.authenticate();

    const notes = await sequelize.query("SELECT * FROM notes", {
      type: QueryTypes.SELECT,
    });
    console.log(notes);
    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

main();
```

- If everything works, make it a web application:

```js
require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

const express = require("express");
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

app.get("/api/notes", async (req, res) => {
  const notes = await sequelize.query("SELECT * FROM notes", {
    type: QueryTypes.SELECT,
  });
  res.json(notes);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- Lets make model Note for notes:

```js
require("dotenv").config();

const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

class Note extends Model {}
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);

app.get("/api/notes", async (req, res) => {
  const notes = await Note.findAll();
  res.json(notes);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- Add these to make route for new notes:

```js
app.use(express.json());

// ...

app.post("/api/notes", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    return res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});
```

## Creating tables automatically

- Destroy the old notes database `drop table notes;`
- Add ` Note.sync()` in index.js file right after the model `Note.init({...})` is defined

## More operators

- Search for single note. Add to `index.js`:

```js
app.get("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});
```

- Modify note:

```js
app.put("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    note.important = req.body.important;
    await note.save();
    res.json(note);
  } else {
    res.status(404).end();
  }
});
```

## Folder Structure

index.js
util
--config.js
--db.js
models
--index.js
--note.js
controllers
--notes.js

#### util/config.js

- Handles environment variables:

```js
require("dotenv").config();

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
};
```

#### index.js

- Launches the application:

```js
const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const notesRouter = require("./controllers/notes");

app.use(express.json());

app.use("/api/notes", notesRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
```

#### util/db.js

- Init the database:

```js
const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("connected to the database");
  } catch (err) {
    console.log("failed to connect to the database");
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize };
```

#### models/note.js

- Note database model:

```js
const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);

module.exports = Note;
```

#### models/index.js

- Almost useless at this point, as there is only one model in the application. WHen we start adding other modesl to the application, the file will become more useful because it will eliminate the need to import files defining individuals modesl in the rest of the application:

```js
const Note = require("./note");

Note.sync();

module.exports = {
  Note,
};
```

#### controllers/notes.js

- Handle note route:

```js
const router = require("express").Router();

const { Note } = require("../models");

router.get("/", async (req, res) => {
  const notes = await Note.findAll();
  res.json(notes);
});

router.post("/", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    await note.destroy();
  }
  res.status(204).end();
});

router.put("/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    note.important = req.body.important;
    await note.save();
    res.json(note);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
```

- The structure of the application is good now. However, we note that the route handlers that handle a single note contain a bit of repetitive code, as all of them begin with the line that searches for the note to be handled:

```js
const note = await Note.findByPk(req.params.id);
```

Let's refactor this into our own middleware and implement it in the route handlers:

```js
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id);
  next();
};

router.get("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy();
  }
  res.status(204).end();
});

router.put("/:id", noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important;
    await req.note.save();
    res.json(req.note);
  } else {
    res.status(404).end();
  }
});
```
