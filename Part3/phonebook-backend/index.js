import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import Person from './models/person.js';

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const app = express();
app.use(express.static('dist'));
app.use(express.json());
morgan.token('content', function (req, _res) {
  return JSON.stringify(req.body);
});
// app.use(morgan('tiny'));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :content'
  )
);

app.get('/info', (_req, res) => {
  const requestTime = new Date().toString();
  const info = `<p>Phonebook has info for ${persons.length} people</p><p>${requestTime}</p>`;
  res.send(info);
});

app.get('/api/people', (_req, res) => {
  res.json(persons);
});

app.get('/api/people/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/people/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.post('/api/people', (req, res) => {
  const name = req.body.name;
  const number = req.body.number;
  const duplicateName = persons.some((p) => p.name === name);

  if (!name || !number || duplicateName) {
    const errorMessage = !name
      ? 'name is not provided'
      : !number
      ? 'number is not provided'
      : 'name must be unique';
    return res.status(400).json({ error: errorMessage });
  }

  const id = String(Math.random()).slice(2, 10);
  const newPerson = { id, name, number };
  persons = persons.concat(newPerson);
  res.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
