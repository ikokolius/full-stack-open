import mongoose from 'mongoose';

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

// The code also assumes that it will be passed the password from the credentials we created in MongoDB Atlas, as a command line parameter with a command `node mongo.js yourPassword`
const password = process.argv[2];

const url = `mongodb+srv://irynakokolius:${password}@cluster0.sbasvzw.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 3) {
  const name = process.argv[3];
  const number = process.argv[4];
  if (!number) {
    console.log('number is required');
    process.exit(1);
  }
  const person = new Person({ name, number });
  try {
    const result = await person.save();
    console.log(`added ${result.name} number ${result.number} to phonebook`);
  } catch (e) {
    console.log(e);
  } finally {
    mongoose.connection.close();
  }
} else {
  Person.find({})
    .then((result) => {
      console.log('phonebook:');
      result.forEach((person) =>
        console.log(`${person.name} ${person.number}`)
      );
      // If the connection is not closed, the connection remains open until the program terminates.
      mongoose.connection.close();
    })
    .catch((e) => console.log(e));
}
