const models = require('../models/starWarsModels');

const starWarsController = {};

starWarsController.getCharacters = (req, res, next) => {
	console.log('test');
	// write code here
	models.Person.find()
		.then((result) => {
			console.log(result);
			res.locals = result;
		})
		.catch((err) => console.log(err.message));

	next();
};

starWarsController.getSpecies = (req, res, next) => {
	// write code here

	next();
};

starWarsController.getHomeworld = (req, res, next) => {
	// write code here

	next();
};

starWarsController.getFilm = (req, res, next) => {
	// write code here

	next();
};

starWarsController.addCharacter = (req, res, next) => {
	// write code here

	next();
};

module.exports = starWarsController;
