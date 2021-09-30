const express = require('express');
morgan = require('morgan');
const app = express();

//express.static
app.use(morgan('common'));
app.use(express.static('public'));
let staticPath = path.join(__public, "static");
app.use(express.static(staticPath));
// app.use('documentation', express.static('public'));


let topMovies = [{
    title: 'Heirs of the Night',
    author: 'D. Van Rooijen'
  },
  {
    title: 'Memoirs of an Invisible Man',
    author: 'John Carpenter'
  },
  {
    title: 'Van Helsing',
    author: 'Stephen Sommers'
  },
  {
    title: 'Inception',
    author: 'Christopher Nolan'
  },
  {
    title: 'Interstellar',
    author: 'Christopher Nolan'
  },
  {
    title: 'Joker',
    author: 'Todd Phillips'
  },
  {
    title: 'Django Unchained',
    author: 'Quentin Tarantino'
  },
  {
    title: 'A Discovery of Witches',
    author: 'Farren Blackburn'
  },
  {
    title: 'Carnival Row',
    author: 'Thor Freudenthal'
  },
  {
    title: 'Altered Carbon',
    author: 'Uta Briesewitz'
  }
];

//create an Express GET route located at the endpoint “/movies” that returns
//a JSON object containing data about your top 10 movies.

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Create another GET route located at the endpoint “/” that returns a default textual response of your choosing.

app.get('/', (req, res) => {
  res.send('Welcome to Movie Paradise!');
});



// //Use the Morgan middleware library to log all requests (instead of using the fs module to write to a text file).


// app.get('/', (req, res) => {
//   res.send('Welcome to Movie Paradise!');
// });


//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  console.log('This is an error');
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});