<h1>Objective</h1>
  <p>
    To build the server-side component of a “movies” web application. The web application will provide users with access
    to information about different movies, directors, and genres. Users will be able to sign up, update their personal
    information, and create a list of their favorite movies.</p>
  <h1>Essential features</h1>
  
  <h2> Code example </h2>
  
  ```/**
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
```




  <ul>
    <li>Return a list of ALL movies to the user</li>
    <li>Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by
      title to the user</li>
    <li> Return data about a genre (description) by name/title (e.g., “Thriller”)
    <li> Return data about a director (bio, birth year, death year) by name</li>
    <li> Allow new users to register</li>
    <li>Allow users to update their user info (username, password, email, date of birth)</li>
    <li> Allow users to add a movie to their list of favorites</li>
    <li> Allow users to remove a movie from their list of favorites</li>
    <li>Allow existing users to deregister</li>
  </ul>
