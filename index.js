const express = require('express'),
morgan = require('morgan'),
fs = require('fs'), // import built in node modules fs and path 
path = require('path');
const app = express();

app.use(morgan('common'));

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));


let topMovies = [
    {
      title: 'Movie1',
      author: 'Bob Roberts'
    },
    {
      title: 'Movie2',
      author: 'Bill Williams'
    },
    {
      title: 'Movie3',
      author: 'Emily Elizabeth'
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
    res.json(topMovies);
  });
  
  /*Return data about a single movie by title to the user */
  app.get('/movies/Movie1', (req, res) => {
    res.json(topMovies[0]);
  });

  /*Return data about a genre (description) by name/title. */
  app.get('/movies/Movie1/Action', (req, res) => {
    res.send('Movie1, action');
  });

  /*Return data about a director (bio, birth year, death year) by name. */
  app.get('/movies/Movie1/James', (req, res) => {
    res.send('Movie1 directed by James');
  });

  /*Allow new users to register */
  app.post('/movies/Movie1/Joe', (req, res) => {
    res.send('registered');
  });

  /*Allow users to update their user info (username)*/
  app.post('/movies/Movie1/Jim', (req, res) => {
    res.send('updated');
  });

  /*Allow users to add a movie to their list of favorites */
  app.post('/movies', (req, res) => {
    res.send('registered!');
  });

  /*Allow users to remove a movie from their list of favorites */
  app.delete('/movies', (req, res) => {
    res.send('removed!');
  });

  /*Allow existing users to deregister */
  app.delete('/movies/Jill', (req, res) => {
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