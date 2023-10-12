require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Person = require("./models/person");

const app = express();

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
app.use(cors());

app.use(express.static("dist"));
// app.use(morgan("tiny"));
app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :body`)
);

app.get("/info", async (req, res) => {
  const date = new Date();
  const persons = await Person.countDocuments();

  res.send(`
	<p>Phonebook has info for ${persons} people</p>
	<p>${date}</p>
	`);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
