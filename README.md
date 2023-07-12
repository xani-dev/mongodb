# Databases Unit

## Summary

In this unit you have will have a backend Node/Express server interact with a database to provide data to a pre-built frontend (react application).


## Learning goals

* Understand the role of databases and how we can set up our backend to retrieve and store data from and to databases.
* Learn the difference between SQL and NoSQL(document store) databases and when you might use one or the other.
* Set up a remote cloud Mongo database on MongoDB Atlas.
* Use node module `mongoose` to interact with a Mongo database.

## What is node-postgres?
Node-postgres is a node module published on npm that provides functions to access a PostgreSQL database whether it is hosted locally (on your machine), or remotely (in the cloud). It lets you send SQL queries from a Node server to the database and provide you the response received from the database. Documentations on how to use it may be found [here](https://node-postgres.com/).

## What is MongoDB/mongoose?
MongoDB is the most popular non-relational database in use today. It is a document-oriented database that can store data in the form of documents, which are similar to objects in javascript. Instead of *tables* in SQL, we have *collections*. Instead of *columns* in SQL, we have *keys*. Instead of *rows* in SQL, we have *documents*.

NoSQL databases like MongoDB are inherently more flexible than SQL databases as they do not need to follow a model. While a SQL table can only contain rows that conform to the specific schema of columns, collections in a NoSQL database can contain documents with different kinds of data that don't neatly fit into a schema. They may even contain arrays and objects that are nested.

Mongoose is a node module published on npm that not only provides a way to access a MongoDB database from a node server but also add a data schema to MongoDB collections. While not being beholden to a schema may be a feature of a NoSQL database, it can also be a cause of confusion and error if data is not organized in a predictable structure. Mongoose aims to solve that by letting developers create schemas and use models created off of that schema to interact with MongoDB.

Documentations for Mongoose can be found [here](https://mongoosejs.com/docs/guide.html).

## What will be the challenge?
We will be creating a database in the cloud and fill it with Star Wars data. Then, we will be working off of a Node+Express app, configuring the backend to retrieve a list of characters from the database and send it to the frontend to display. We will also be retrieving additional information about a character's species, homeworld, and films they've been in from the database. Finally, we will be adding the ability to add a new character into the database. We will do this with MongoDB.

You do not need to modify any frontend code, only the backend, but feel free to look around if you are curious.

<hr />

## Challenges

### Part 2: MongoDB/mongoose

#### Set up / Install

1. [ ] Install the MongoDB Community edition by following the instructions on the links below.
   * [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/) - select your distro
   * [MacOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/) - must have homebrew
   * [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
   * You can check to make sure the CLI is installed by typing `mongod --version` or `mongosh --version` in a terminal.
1. [ ] Sign up for a MongoDB Atlas account [here](https://www.mongodb.com/cloud/atlas).
   * Choose a provider and region where the free tier is available and select that free tier. Be sure to opt out of any features like backups that will cost extra.
   * Go to your Cluster view and click on **CONNECT**.
    ![mongodb_atlas_connect](/docs/images/mongodb_atlas_connect.png)
   * Setup connection security by whitelisting your connection IP address and creating a MongoDB User. Remember this username and password for the next step.
   * For the connection method, select "Connect Your Application" and copy the connection string.
   * Open a terminal ***in this project directory*** and run the command below. Make sure you have replaced `<password>` in your connection string with your MongoDB user password created earlier and wrap the entire string with double quotes. This command will create a database called **starwars** in your cloud database with data from the `dump/` folder.
   ```
    mongorestore -db=starwars --uri="<YOUR_CONNECTION_STRING>" dump
   ```
   * You can check to see if the database was restored properly by clicking on the **COLLECTIONS** button from the MongoDB Atlas site.
   * NOTE: Take a look at the **people** collection of your database and see the documents that are stored there. To take full advantage of the performance benefits of using a NoSQL database, some data have been *denormalized*. Which of the keys in the database do you think those are? What are the pros and cons of doing such denormalization?
   * The denormalization can make certain retrieval of data easier and faster as we will see shortly but we do that at the cost of losing _consistency_. The same information now lives in multiple places so if we need to insert or update data it makes it more costly and difficult as well as taking up more space due to having redundant data. We also do not have one source of truth but have multiple sources which can be problematic.
   * Some properties in this collection are also references to other objects/documents, similar to a foreign key in SQL. However, MongoDB does not enforce referential integrity such that this reference is not guaranteed to actually point to an existing document like a SQL foreign key would. The reference could point to nothing but the database will not complain, making it somewhat dangerous.
1. [ ] Now, install your npm dependencies by running `npm install` in your terminal.
1. [ ] Run `npm run dev` to start your server and bundle the frontend. It will launch the frontend application in a browser window which will currently have no characters.

#### Set up your model
1. [ ] Take a look at the `server/models/starWarsModels.js`. This is where you will set up the connection to the database, set the schema, and export Models that will be used to interact with the database.
1. [ ] Add your connection string from earlier, with the password filled in, to `MONGO_URI` so that we can use `mongoose.connect()` to start a connection to the database.
1. [ ] Notice that a schema and model is already made for you for *species*. Study this syntax.
1. [ ] Define the schema and use them to create respective models for each of the collections below:
   * planet (collection name will pluralize to planets)

        | Key             | Type   |
        |-----------------|--------|
        | name            | String |
        | rotation_period | Number |
        | orbital_period  | Number |
        | diameter        | Number |
        | climate         | String |
        | gravity         | String |
        | terrain         | String |
        | surface_water   | String |
        | population      | Number |

   * film (collection name will pluralize to films)

        | Key             | Type   |
        |-----------------|--------|
        | title           | String |
        | episode_id      | Number |
        | opening_Crawl   | String |
        | director        | String |
        | producer        | String |
        | release_date    | Date   |

   * person (collection name will pluralize to people)

        | Key             | Type                           |
        |-----------------|--------------------------------|
        | name            | String (required)              |
        | mass            | String                         |
        | hair_color      | String                         |
        | skin_color      | String                         |
        | eye_color       | String                         |
        | birth_year      | String                         |
        | gender          | String                         |
        | species         | String                         |
        | species_id      | ObjectId referencing 'species' |
        | homeworld       | String                         |
        | homeworld_id    | ObjectId referencing 'planet'  |
        | height          | Number                         |
        | films           | Array of objects with keys: title (String), id (ObjectId referencing 'film') |
1. [ ] Notice at the bottom of the file that we are exporting the created Species model from this file in an object that will be required in the controller file. Uncomment the others as you go along so they can be exported as well!

#### Get and serve characters
1. [ ] On load, the frontend makes a GET request to `/api/` to get an array of characters. Check out the route handlers are in the `server/routes/api.js` file and controllers are in the `server/controllers/starWarsController.js` file.
1. [ ] Fill out the `starWarsController.getCharacters` middleware using the models that were required in to access the **people** collection using the `Person` model. You may want to look up methods that are available on mongoose models from the docs.
1. [ ] Save the results from the database into `res.locals` and move on to the next middleware.
   * Be careful when working with asynchronous functions and make sure you are also properly handling errors.
   * Similar to `pg`'s `pool.query()`, the `mongoose`'s Model methods can take a callback function that will run once the database query is made, or you can chain a `.then()` like a promise. Mongoose queries, however, do not return a true promise object so you will not be able to use `.catch()` unless you do a `.exec()` after the query to make it into a promise. More information on this behavior can be found [here](https://mongoosejs.com/docs/promises.html).
1. [ ] Update the route handler to send the data stored in `res.locals` instead of an empty array. Remember, the frontend is expecting an array of objects. Refresh the frontend and you should be seeing cards for all the characters in the database.
1. [ ] Notes on the use of NoSQL database with denormalization:
   * Due to the denormalized data in the **people** collection, we do not need to make any additional queries or "joins". We can grab everything including an array of films all with one query.
   * However, if we ever had to change any data in our database like change the name of a planet, we now have multiple locations where this information is so we have to make sure to change it in all the places.
   * The structure is also such that we have an array of films inside a person which makes it convenient to find all the films a person has been in, but if we ever had to find all the people that show up in a film, we would have to dig through every person document to see if they have been part of a film, making it a very costly operation.
   * This is why we have to be very careful and certain about when we want to be using a NoSQL database.

#### Get and serve species details
1. [ ] Let's populate the details modal for the species. The frontend makes a GET request to `/api/species` for this information. The GET request will include the id of the species in a query string like `/api/species?id=5d963c76273db10a425ce9c8`.
1. [ ] Back in the `server/controllers/starWarsController.js`, fill in the code for `starWarsController.getSpecies` middleware. You will need to grab the id from the **req**uest's query string and use it to find the data from the species collection.
   * NOTE: the _homeworld_ that is a planet name is denormalized here as well so it will not require another query to the **planet** collection. Same cons of denormalization, however, applies here as well.
1. [ ] Just as before, pass the data along to the next middleware and send it to the frontend. The frontend is expecting just one object with key-values pertaining to the species.
1. [ ] Once this is done, try and click the blue question mark next to a species to see its details be populated.

#### Get and serve homeworld details
1. [ ] Similarly to the species above, the homeworld also has a question mark for a modal to show the homeworld planet's details. It makes a GET request to `/api/getHomeworld` again with a query string that includes the id. Complete the `starWarsController.getHomeworld` middleware to find corresponding the planet from the database, pass it to the next middleware which will send it to the frontend as an object.
1. [ ] Check by clicking on a blue question mark next to a homeworld on the frontend.

#### Get and serve film details
1. [ ] Each film in the character card also has a question mark for a modal to show the homeworld planet's details. It makes a GET request to `/api/getFilm` again with a query string that includes the id. Complete the `starWarsController.getFilm` middleware to find the corresponding film from the database, pass it to the next middleware which will send it to the frontend as an object.
1. [ ] Check by clicking on a blue question mark next to a film on the frontend.

#### Add a new character
1. [ ] On the top-right corner of the frontend app is a button labeled "Create Character". Clicking it will take you to a character creation page. Filling out the form and clicking on the "Save" button will send a POST request to the backend to `/api/character`. This POST request will include a body with the following keys `name, gender, species, species_id, birth_year, eye_color, skin_color, hair_color, mass, height, homeworld, homeworld_id, films`. Feel free to `console.log` the request body to see what kinds of value they contain.
1. [ ] In `server/controllers/starWarsController.js`, complete the `starWarsController.addCharacter` middleware to take all these values from the request body and use them to create a new person in the **people** collection. The frontend is not relying on any data to be sent back besides just a 200 status but if successful, you should see your new character show up in the character list at the end as it re-fetches from the database.
   * You can also check to see if your character was added by viewing your collection in the MongoDB Atlas site.

#### Extensions
1. [ ] Try to make additional routes and controllers to update and delete records from the database. While we do not have a frontend to make those requests, you can still use Postman to hit those endpoints and trigger the controller.
1. [ ] The node module `mongodb` is the official MongoDB driver for NodeJS whose documentation is [here](https://mongodb.github.io/node-mongodb-native/3.3/). This is another way for a NodeJS server to interact with a MongoDB database without the constraints of having a schema or creating a model. Checkout to a new branch and refactor your code to use this library instead of `mongoose`.
