const express = require('express')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');



const Comment = require('./models/comment')

const Review = require("./models/review")

// INITIALIZE BODY-PARSER AND ADD IT TO APP
const bodyParser = require('body-parser');


// The following line must appear AFTER const app = express() and before your routes!
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



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

// NEW
app.get('/reviews/new', (req, res) => {
  res.render('reviews-new', {});
})

// CREATE
app.post('/reviews', (req, res) => {
  Review.create(req.body).then((review) => {
    console.log(review)
    res.redirect(`/reviews/${review._id}`) // Redirect to reviews/:id
  }).catch((err) => {
    console.log(err.message)
  })
})

// SHOW
app.get('/reviews/:id', (req, res) => {
  // find review
  Review.findById(req.params.id).then(review => {
    // fetch its comments
    Comment.find({ reviewId: req.params.id }).then(comments => {
      // respond with the template with both values
      res.render('reviews-show', { review: review, comments: comments })
    })
  }).catch((err) => {
    // catch errors
    console.log(err.message)
  });
});

// EDIT
app.get('/reviews/:id/edit', function (req, res) {
  Review.findById(req.params.id, function(err, review) {
    res.render('reviews-edit', {review: review});
  })
})

// UPDATE
app.put('/reviews/:id', (req, res) => {
  Review.findByIdAndUpdate(req.params.id, req.body)
    .then(review => {
      res.redirect(`/reviews/${review._id}`)
    })
    .catch(err => {
      console.log(err.message)
    })
})

// DELETE
app.delete('/reviews/:id', function (req, res) {
  console.log("DELETE review")
  Review.findByIdAndRemove(req.params.id).then((review) => {
    res.redirect('/');
  }).catch((err) => {
    console.log(err.message);
  })
})

var reviewRoutes = require('./controllers/reviews');
var commentRoutes = require('./controllers/comments');

reviewRoutes(app, Review);
commentRoutes(app, Comment);


app.listen(port);

module.exports = app;
