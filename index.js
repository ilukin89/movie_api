const express = require('express');
morgan = require('morgan');
const app = express();

//express.static
app.use(morgan('common'));
app.use(express.static('public'));
// app.use('documentation', express.static('public'));


let movies = [{
    title: 'Heirs of the Night',
    author: 'D. Van Rooijen',
    genre: 'Sci-Fi'
  },
  {
    title: 'Memoirs of an Invisible Man',
    author: 'John Carpenter',
    genre: 'Thriller'
  },
  {
    title: 'Van Helsing',
    author: 'Stephen Sommers',
    genre: 'Sci-Fi'
  },
  {
    title: 'Inception',
    author: 'Christopher Nolan',
    genre: 'Sci-Fi, Thriller'
  },
  {
    title: 'Interstellar',
    author: 'Christopher Nolan',
    genre: 'Sci-Fi, Thriller'
  },
  {
    title: 'Joker',
    author: 'Todd Phillips',
    genre: 'Drama'
  },
  {
    title: 'Django Unchained',
    author: 'Quentin Tarantino',
    genre: 'Adventure, Drama'
  },
  {
    title: 'A Discovery of Witches',
    author: 'Farren Blackburn',
    genre: 'Sci-Fi'
  },
  {
    title: 'Carnival Row',
    author: 'Thor Freudenthal',
    genre: 'Sci-Fi'
  },
  {
    title: 'Altered Carbon',
    author: 'Uta Briesewitz',
    genre: 'Sci-Fi, Action'
  }
];

//create an Express GET route located at the endpoint “/movies” that returns
//a JSON object containing data about your top 10 movies.

app.get('/movies', (req, res) => {
  res.json(movies);
});

// Create another GET route located at the endpoint “/” that returns a default textual response of your choosing.

app.get('/', (req, res) => {
  res.send('Welcome to Movie Paradise!');
});

// Return a list of all movies 

app.get('/movies', (req, res) => {
  res.json(movies);
});

// Return single movie data by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

// Return genre by name/title

app.get('/movies/:genre', (req, res) => {
  res.json(movies.find((genre) => {
    return movies.genre === req.params.genre
  }));
});

// Return data about director 

app.get('/movies/:director', (req, res) => {
  res.json(movies.find((director) => {
    return movies.director === req.params.director
  }));
});

// User registration

app.post('/users/register', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).send(newUser);
  }
});

// update  user info (username)

app.put('/users/edit/:username/', (req, res) => {
  let user = users.find((user) => {
    return user.name === req.params.name
  });

  if (user) {
    user.name[req.params.name] = parseInt(req.params.username);
    res.status(201).send('User ' + req.params.name + ' was assigned a username of ' + req.params.username);
  } else {
    res.status(404).send('User with the name ' + req.params.name + ' was not found.');
  }
});

// add a movie to the list of favorites

app.post('/users/:username/movies/:id', (req, res) => {
  let favMovie = req.body;
  let movie = movies.find((movie) => {
    return movie.id === req.params.id
  });

  if (!favMovie.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    favMovie.id = uuid.v4();
    movies.push(favMovies);
    res.status(201).send(favMovie);
  }
});

// Allow users to remove a movie from their list of favorites	

app.delete('/users/:username/movies/:id', (req, res) => {
  let movie = movies.find((movie) => {
    return movie.id === req.params.id
  });

  if (movie) {
    movies = movies.filter((obj) => {
      return obj.id !== req.params.id
    });
    res.status(201).send('Movie ' + req.params.id + ' is deleted.');
  }
});

//Allow existing users to deregister	

app.delete('/users/:id', (req, res) => {
  let user = users.find((user) => {
    return user.id === req.params.id
  });

  if (user) {
    users = users.filter((obj) => {
      return obj.id !== req.params.id
    });
    res.status(201).send('User ' + req.params.id + ' is deleted.');
  }
});

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