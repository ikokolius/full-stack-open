import mongoose from 'mongoose';
import dotenv from 'dotenv';

mongoose.set('strictQuery', false);
dotenv.config();

// without dotenv run MONGODB_URI="your_connection_string_here" npm run dev
const url = process.env.MONGODB_URI;

console.log('connecting to', url);
mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const personSchema = new mongoose.Schema({
  // name: String,
  // number: String
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: true,
    // or with custom error message
    // required: [true, 'Name is required'],
  },
  number: {
    type: String,
    required: true,
    // required: [true, 'Phone number is required'],
    // match: [
    //   /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)?\d{4}$/,
    //   'Please fill a valid phone number',
    // ],
    minLength: [8, 'Phone number must be at least 8 characters long'],
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{4,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
});

// One way to format the objects returned by Mongoose is to modify the toJSON method of the schema, which is used on all instances of the models produced with that schema.
personSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model('Person', personSchema);

export default Person;
