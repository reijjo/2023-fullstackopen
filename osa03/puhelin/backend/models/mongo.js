const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument!");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.ki8kl40.mongodb.net/puhelin?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("persons", personSchema);

const newName = process.argv[3];
const newNumber = process.argv[4];

const person = new Person({
  name: newName,
  number: newNumber,
});

if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length > 5) {
  console.log("TOo many arguments");
  mongoose.connection.close();
}
