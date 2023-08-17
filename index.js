const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://127.0.0.1/test', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true
  });


const express = require('express'),
morgan = require('morgan'),
fs = require('fs'), // import built in node modules fs and path 
path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(morgan('common'));

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my book club!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  /*Return a list of ALL movies to the user */
  app.get('/movies', async (req, res) => {
    /*res.json(movies);*/
    Movies.find().then(movies => res.json(movies));
  });
  
  /*Return data about a single movie by title to the user */
  app.get('/movies/:title', async (req, res) => {
    /*res.json(movies[0]);*/
    await Movies.findOne({ Title: req.params.title })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  /*Return data about a genre (description) by name/title. */
  app.get('/movies/genres/:genrename', async (req, res) => {
    /*res.send('Movie1, action');*/
    await Movies.findOne({ "Genre.Name": req.params.genrename })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  /*Return data about a director (bio, birth year, death year) by name. */
  app.get('/movies/directors/:director', async (req, res) => {
    /*res.send('Movie1 directed by James');*/
    await Movies.findOne({ "Director.Name": req.params.director })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

  /*Allow new users to register */
  app.post('/users', async (req, res) => {
    /*res.send('registered');*/
      await Users.findOne()
        .then((user) => {
          if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
          } else {
            Users
              .create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
              })
              .then((user) =>{res.status(201).json(user) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        });
  });

  /*Allow users to update their user info (username)*/
  app.put('/users/:Username', async (req, res) => {
    /*res.send('updated');*/
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        /*Birthday: req.body.Birthday*/
      }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  });

  /*Allow users to add a movie to their list of favorites */
  app.post('/users/:Username/movies/:Title', async (req, res) => {
    /*res.send('registered!');*/
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavoriteMovies: req.params.Title }
    },
    { new: true }) // This line makes sure that the updated document is returned
   .then((updatedUser) => {
     res.json(updatedUser);
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
  });

  /*Allow users to remove a movie from their list of favorites */
  app.delete('/users/:Username/movies/:Title', async (req, res) => {
    /*res.send('removed!');*/
    await Users.findOneAndRemove({ Username: req.params.Username }, {
      $pull: { FavoriteMovies: req.params.Title }
    },
    { new: true }) // This line makes sure that the updated document is returned
   .then((updatedUser) => {
     res.json(updatedUser);
   })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
   });
  });

  /*Allow existing users to deregister */
  app.delete('/users/:Username', async (req, res) => {
    /*res.send('deregistered!');*/
    await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });


  app.use(express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });