const mongoose = require('mongoose');

//movie schema

let movieSchema = mongoose.Schema({
  Title: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Genre: {
    Name: String,
    Description: String
  },

  Director: {
    Name: String,
    Bio: String,
    Birth: Date
  },

  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

//user schema

let userSchema = mongoose.Schema({
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Birthday: Date,
  FavoriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});

//creating director schema
// let directorSchema = mongoose.Schema({
//   Name: {
//     type: String,
//     required: true
//   },
//   Bio: {
//     type: String,
//     required: true
//   },
//   Birthdate: {
//     type: Date,
//     required: true
//   },
//   Films: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Movie"
//   }]
// });

//creating genre schema
// let genreSchema = mongoose.Schema({
//   Name: {
//     type: String,
//     required: true
//   },
//   Description: {
//     type: String,
//     required: true
//   }
// })


let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
// let Genre = mongoose.model('Genre', genreSchema);
// let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
// module.exports.Director = Director;
// module.exports.Genre = Genre;