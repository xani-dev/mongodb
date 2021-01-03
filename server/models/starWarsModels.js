const mongoose = require('mongoose');

const MONGO_URI = 'YOUR_URI_HERE';

mongoose.connect(MONGO_URI, {
  // options for the connect method to parse the URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // sets the name of the DB that our collections are part of
  dbName: 'starwars'
})
  .then(() => console.log('Connected to Mongo DB.'))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

// sets a schema for the 'species' collection
const speciesSchema = new Schema({
  name: String,
  classification: String,
  average_height: String,
  average_lifespan: String,
  hair_colors: String,
  skin_colors: String,
  eye_colors: String,
  language: String,
  homeworld: String,
  homeworld_id: {
    // type of ObjectId makes this behave like a foreign key referencing the 'planet' collection
    type: Schema.Types.ObjectId,
    ref: 'planet'
  }
});

// creats a model for the 'species' collection that will be part of the export
const Species = mongoose.model('species', speciesSchema);


// TODO: create a schema for 'planet' and use it to create the model for it below



// TODO: create a schema for 'film' and use it to create the model for it below



// TODO: create a schema for 'person' and use it to create the model for it below



// exports all the models in an object to be used in the controller
module.exports = {
  Species,
  // Planet,
  // Film,
  // Person
};
