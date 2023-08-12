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


let movies = [
    {
      title: 'Movie1',
      author: 'Bob Roberts'
    },
    {
      title: 'Movie2',
      author: 'Bill Williams'
    }
  ];
  

  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my book club!');
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
  /*Return a list of ALL movies to the user */
  app.get('/movies', (req, res) => {
    res.json(movies);
  });
  
  /*Return data about a single movie by title to the user */
  app.get('/movies/:title', (req, res) => {
    res.json(movies[0]);
  });

  /*Return data about a genre (description) by name/title. */
  app.get('/movies/genres/:genreName', (req, res) => {
    res.send('Movie1, action');
  });

  /*Return data about a director (bio, birth year, death year) by name. */
  app.get('/movies/directors/:director', (req, res) => {
    res.send('Movie1 directed by James');
  });

  /*Allow new users to register */
  app.post('/users', (req, res) => {
    res.send('registered');
  });

  /*Allow users to update their user info (username)*/
  app.put('/users', (req, res) => {
    res.send('updated');
  });

  /*Allow users to add a movie to their list of favorites */
  app.post('/users/:movie', (req, res) => {
    res.send('registered!');
  });

  /*Allow users to remove a movie from their list of favorites */
  app.delete('/users/:movie', (req, res) => {
    res.send('removed!');
  });

  /*Allow existing users to deregister */
  app.delete('/users', (req, res) => {
    res.send('deregistered!');
  });
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  app.get('/', (req, res) => {
    res.send('Welcome to my movie club!');
  });

  app.use(express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });