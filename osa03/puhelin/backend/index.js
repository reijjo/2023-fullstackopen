require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Person = require("./models/person");

const app = express();

// Middleware

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

const errorHandler = (error, req, res, next) => {
  console.error("FROM ERROR HANDLER", error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

// END Middleware

app.use(express.json());
app.use(cors());

app.use(express.static("dist"));
// app.use(morgan("tiny"));
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :body`)
);

// ROUTES

// info

app.get("/info", async (req, res) => {
  const date = new Date();
  const persons = await Person.countDocuments();

  res.send(`
	<p>Phonebook has info for ${persons} people</p>
	<p>${date}</p>
	`);
});

// api/persons

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (name === undefined || number === undefined) {
    return res.status(400).json({
      error: "Name or number missing",
    });
  }

  const person = new Person({
    name: name,
    number: number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

// api/persons/:id

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// END ROUTES

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
