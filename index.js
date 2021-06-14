const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());
morgan.token("body", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
const phonebook = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" },
];
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const thePerson = phonebook.find((person) => person.id === id);
  if (thePerson) {
    res.json(thePerson);
  } else {
    res.status(404).end();
  }
});
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const thePerson = phonebook.findIndex((person) => person.id === id);
  if (thePerson !== -1) {
    phonebook.splice(thePerson, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});
app.get("/api/persons", (req, res) => {
  res.json(phonebook);
});
app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    res.json({ error: "name must be non-empty" });
    return;
  }
  if (!req.body.number) {
    res.json({ error: "number must be non-empty" });
    return;
  }
  if (phonebook.find((person) => person.name === req.body.name)) {
    res.json({ error: "name must be unique" });
    return;
  }
  const newPerson = {
    id: Math.ceil(Math.random() * 100000),
    name: req.body.name,
    number: req.body.number,
  };
  phonebook.push(newPerson);
  res.status(204).end();
});
app.get("/info", (req, res) => {
  res.send(`
  <p>Phonebook has info for ${phonebook.length} people</p>
  <p>${new Date()}</p>
  `);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
