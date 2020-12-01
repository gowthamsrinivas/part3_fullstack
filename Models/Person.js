const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
    console.log('Connected to MongoDB');
})
.catch(error => {
    console.log(`error connecting to mongoDB ${error.message}`);
})

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, minlength: 3 },
  date: {type: Date, required: true},
  number: {type: String, minlength: 8},
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Person', personSchema);
