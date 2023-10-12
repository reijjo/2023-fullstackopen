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

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({
      error: "Name or number missing",
    });
  }
  // else if (persons.find((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "Name must be unique",
  //   });
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
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
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
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
