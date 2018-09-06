const express = require('express')
const app = express()

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/rotten-potatoes', { useMongoClient: true });

const Review = mongoose.model('Review', {
  title: String
});

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//
// app.get('/', (req, res) => {
//     res.render('home', { msg: 'Hello World!' });
// })

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})

// // OUR MOCK ARRAY OF PROJECTS
// let reviews = [
//   { title: "First Review" },
//   { title: "Next Review" }
// ]


// INDEX
app.get('/', (req, res) => {
  Review.find()
    .then(reviews => {
      res.render('reviews-index', { reviews: reviews });
    })
    .catch(err => {
      console.log(err);
    })
})
