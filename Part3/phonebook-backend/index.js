import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import Person from './models/person.js';

const app = express();
// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
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

app.get('/info', (request, response, next) => {
  const requestTime = new Date().toString();
  Person.countDocuments({})
    .then((count) => {
      const info = `<p>Phonebook has info for ${count} people</p><p>${requestTime}</p>`;
      response.send(info);
    })
    .catch((error) => next(error));
});

app.get('/api/people', (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
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

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/people', (request, response, next) => {
  const name = request.body.name;
  const number = request.body.number;
  const newPerson = new Person({ name, number });
  newPerson
    .save()
    .then((savedPerson) => {
      response.status(201).json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/api/people/:id', (request, response, next) => {
  const id = request.params.id;
  const number = request.body.number;
  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      person.number = number;
      person
        .save()
        .then((savedPerson) => {
          response.status(200).json(savedPerson);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

// It's also important that the middleware for handling unsupported routes is loaded only after all the endpoints have been defined
app.use(unknownEndpoint);

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
