import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import Person from './models/person.js';

const app = express();
// handler of requests with unknown endpoint
const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
const errorHandler = (error, _request, response, next) => {
  console.error(error.message);
  console.log('error name:', error.name);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    console.log(error.errors['name']);
    if (error.errors['name']) {
      return response.status(400).json({ error: error.errors['name'].message });
    } else if (error.errors['number']) {
      return response
        .status(400)
        .json({ error: error.errors['number'].message });
    }
  }

  next(error);
};

app.use(express.static('dist'));
// The json-parser middleware should be among the very first middleware loaded into Express
app.use(express.json());
// logging with morgan
morgan.token('content', function (request) {
  return JSON.stringify(request.body);
});
// app.use(morgan('tiny'));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :content'
  )
);

app.get('/info', async (_request, response) => {
  const requestTime = new Date().toString();
  try {
    const count = await Person.countDocuments({});
    const info = `<p>Phonebook has info for ${count} people</p><p>${requestTime}</p>`;
    response.send(info);
  } catch (error) {
    response.status(500).json({ error: 'Failed to retrieve information' });
  }
});

app.get('/api/people', async (_request, response) => {
  try {
    const people = await Person.find({});
    response.json(people);
  } catch (error) {
    console.error('Error fetching people:', error);
    response.status(500).json({ error: 'Failed to fetch people' });
  }
});

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/people/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    const deletedPerson = await Person.findByIdAndDelete(id);
    if (!deletedPerson) {
      return response.status(404).json({ error: 'Person not found' });
    }
    response.status(204).json(deletedPerson);
  } catch (error) {
    // console.error('Error deleting person:', error);
    // response.status(500).json({ error: 'Failed to delete person' });
    next(error);
  }
});

app.post('/api/people', async (request, response, next) => {
  const name = request.body.name.trim();
  const number = request.body.number.trim();

  if (!name || !number) {
    const errorMessage = !name
      ? 'name is not provided'
      : 'number is not provided';
    return response.status(400).json({ error: errorMessage });
  }

  const newPerson = new Person({ name, number });

  try {
    const savedPerson = await newPerson.save();
    response.status(201).json(savedPerson);
  } catch (error) {
    // console.error('Error saving person:', error);
    // response.status(500).json({ error: 'Failed to save person' });
    next(error);
  }
});

app.put('/api/people/:id', async (request, response, next) => {
  const id = request.params.id;
  const name = request.body.name.trim();
  const number = request.body.number.trim();

  try {
    const person = await Person.findById(id);

    if (!person) {
      // return response.status(404).end();
      return response.status(404).json({ error: 'Person not found' });
    }

    person.name = name;
    person.number = number;
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    // console.error('Error updating person:', error);
    // response.status(500).json({ error: 'Failed to update person' });
    next(error);
  }
});

// It's also important that the middleware for handling unsupported routes is loaded only after all the endpoints have been defined
app.use(unknownEndpoint);

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
