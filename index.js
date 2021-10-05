const express = require('express');
const {
  v4: uuidv4
} = require('uuid');
morgan = require('morgan');
const app = express();

//express.static
app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));
// app.use('documentation', express.static('public'));

let movies = [{
    title: 'Heirs of the Night',
    author: 'D. Van Rooijen',
    genre: 'Sci-Fi',
    userId: 1
  },
  {
    title: 'Memoirs of an Invisible Man',
    author: 'John Carpenter',
    genre: 'Thriller'
  },
  {
    title: 'Van Helsing',
    author: 'Stephen Sommers',
    genre: 'Sci-Fi',
    userId: 1
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

let users = [{
    id: 1,
    name: 'Jessica Drake'
  },
  {
    id: 2,
    name: 'Maria Milton'
  },
  {
    id: 3,
    name: 'Robert Fenyer'
  },
]

//create an Express GET route located at the endpoint “/movies” that returns
//a JSON object containing data about your top 10 movies.

app.get('/movies', (req, res) => {
  return res.json(movies);
});

// Create another GET route located at the endpoint “/” that returns a default textual response of your choosing.

app.get('/', (req, res) => {
  return res.send('Welcome to Movie Paradise!');
});

// Return a list of all movies 

app.get('/movies', (req, res) => {
  return res.json(movies);
});


app.get('/users', (req, res) => {
  return res.json(users);
});

// Return single movie data by title
app.get('/movies/:title', (req, res) => {
  return res.json(movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

// Return genre by name/title

app.get('/movies/genre/:genre', (req, res) => {
  const genre = req.params.genre.toLowerCase();
  console.log(genre)
  return res.json(movies.find((movie) => {
    return movie.genre.toLowerCase().includes(genre);
  }));
});

// Return data about director 

app.get('/movies/director/:director', (req, res) => {
  return res.json(movies.find((movie) => {
    return movie.author.toLowerCase() === req.params.director.toLowerCase()
  }));
});

// User registration

app.post('/users/register', (req, res) => {

  let newUser = req.body;
  console.log({
    newUser
  });

  if (!newUser.name) {
    const message = 'Missing name in request body';
    return res.status(400).send(message);
  } else {
    newUser.id = uuidv4();
    users.push(newUser);
    return res.status(201).send(newUser);
  }
});

// update  user info (username)

app.put('/users/edit/:id', (req, res) => {
  const username = req.body.name;
  let user = users.find((user) => {
    return user.id === parseInt(req.params.id);
  });

  if (user) {
    user.name = username;
    return res.status(201).send(user);
  } else {
    return res.status(404).send('User with the provided name was not found.');
  }
});

// add a movie to the list of favorites
// users/movies/userid

app.post('/users/movies/:id', (req, res) => {
  const id = req.params.id;
  const title = req.body.title;
  const author = req.body.author;
  const genre = req.body.genre;

  // let movie = movies.find((movie) => {
  //   return movie.id === req.params.id
  // });

  const user = users.find(user => user.id === parseInt(id));

  if (!user) {
    returnres.status(404).send('User with the provided id was not found.');
  }

  if (!title || !author || !genre) {
    const message = 'Missing title, author, genre in request body';
    return res.status(400).send(message);
  } else {
    const movie = {
      title,
      author,
      genre,
      id // userid
    }
    movies.push(movie);
    return res.status(201).send(movie);
  }
});

// Allow users to remove a movie from their list of favorites	
// users/movies/userid

app.delete('/users/movies/:id', (req, res) => {
  const id = req.params.id;
  const title = req.body.title;

  const user = users.find(user => user.id === parseInt(id));

  if (!user) {
    returnres.status(404).send('User with the provided id was not found.');
  }

  movies = movies.filter((movie) => {
    return movie.title !== title;
  });
  res.status(201).send('Movie is successfully deleted.');
});

//Allow existing users to deregister	

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  let user = users.find((user) => {
    return user.id === userId
  });

  if (user) {
    users = users.filter((user) => {
      return user.id !== userId
    });
    res.status(201).send('User is successfully deleted.');
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