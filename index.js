const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const {
  check,
  validationResult
} = require('express-validator');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static('public'));


const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;



//cors
app.use(cors());

/* ALLOW CERTAIN DOMAINS ONLY */


// let allowedOrigins = ['http://localhost:1234', 'https://i.ibb.co'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));


// let allowedOrigins = ['http://localhost:1234', 'https://i.ibb.co', 'http://localhost:4200/'];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
//       let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
//       return callback(new Error(message), false);
//     }
//     return callback(null, true);
//   }
// }));


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/* LOCAL DATABASE */

// mongoose.connect('mongodb://localhost:27017/test', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });


mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//calling passport and authorization 
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

// Create another GET route located at the endpoint “/” that returns a default textual response of your choosing.

app.get('/', (req, res) => {
  return res.send('Welcome to Movie Paradise!');
});


/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch movies. "url/movies"
 * @returns {object} - returns the movie object
  * @requires authentication JWT
 */

app.get('/movies', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


/** Get list of users */

app.get('/users', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** Return movie by title */
/**
 * Get movies by title
 * @method GET
 * @param {string} endpoint - endpoint - fetch movies by title
 * @param {string} Title - is used to get specific movie "url/movies/:Title"
 * @returns {object} - returns the movie with specific title
 * @requires authentication JWT
 */
app.get('/movies/:Title', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
    Title: req.params.Title
  })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});





//Return genre by name
/**
 * Get genre by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch movies by genre
 * @param {string} Name - is used to get specific movie "url/movies/genres/:Name"
 * @returns {object} - returns the genre with specific name
 * @requires authentication JWT
 */
app.get('/movies/genre/:Name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
    'Genre.Name': req.params.Name
  })
    .then((genre) => {
      res.json(genre.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});




/**
 * Get director by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch director by name
 * @param {string} Name - is used to get specific director "url/directors/:Name"
 * @returns {object} - returns a specific director
 */
app.get('/movies/director/:Name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
    'Director.Name': req.params.Name
  })
    .then((director) => {
      res.json(director.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** Register user */
/**
 * Add user
 * @method POST
 * @param {string} endpoint - endpoint to add user. "url/users"
 * @param {string} Username - choosen by user
 * @param {string} Password - user's password
 * @param {string} Email - user's e-mail adress
 * @param {string} Birthday - user's birthday
 * @returns {object} - new user
 * @requires auth no authentication - public
 */

app.post('/users/', [
  check('Username', 'Username is required').isLength({
    min: 5
  }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({
    Username: req.body.Username
  })
    .then((user) => {
      if (user) {
        // console.log(user);
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user)
          })
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

/**
 * Get user by username
 * @method GET
 * @param {string} endpoint - endpoint - fetch user by username
 * @param {string} Username - is used to get specific user "url/users/:Username"
 * @returns {object} - returns a specific user
 * @requires authentication JWT
 */
app.get('/users/:Username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOne({
    Username: req.params.Username
  })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/** Edit user info */
/**
  * Update user by username
  * @method PUT
  * @param {string} endpoint - endpoint to add user. "url/users/:Username"
  * @param {string} Username - required
  * @param {string} Password - user's new password
  * @param {string} Email - user's new e-mail adress
  * @param {string} Birthday - user's new birthday
  * @returns {string} - returns success/error message
  * @requires authentication JWT
  */

app.put('/users/:Username', [
  check('Username', 'Username is required').isLength({
    min: 5
  }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);

  Users.findOneAndUpdate({
    Username: req.params.Username
  }, {
    $set: {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  }, {
    new: true
  }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});


/**
 * Add movie to favorites
 * @method POST
 * @param {string} endpoint - endpoint to add movies to favorites
 * @param {string} Title, Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.post('/users/:Username/movies/:MovieID', [
  check('Username', 'Username is required').isLength({
    min: 5
  }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
], passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }
  Users.findOneAndUpdate({
    Username: req.params.Username
  }, {
    $push: {
      FavoriteMovies: req.params.MovieID
    }
  }, {
    new: true
  }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

/**
 * Delete movie from favorites
 * @method DELETE
 * @param {string} endpoint - endpoint to remove movies from favorites
 * @param {string} Title Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
    Username: req.params.Username
  }, {
    $pull: {
      FavoriteMovies: req.params.MovieID
    }
  }, {
    new: true
  }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});




/**
  * Delete user by username
  * @method DELETE
  * @param {string} endpoint - endpoint - delete user by username
  * @param {string} Username - is used to delete specific user "url/users/:Username"
  * @returns {string} success/error message
  * @requires authentication JWT
  */
app.delete('/users/:Username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndRemove({
    Username: req.params.Username
  })
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

/** Error handling */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  console.log('This is an error');
});


// listen for requests
// app.listen(8080, () => {
//   console.log('Your app is listening on port 8080.');
// });
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
