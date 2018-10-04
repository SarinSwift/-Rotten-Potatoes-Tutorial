module.exports = (app) => {

  // NEW Comment
  app.post('/reviews/comments', (req, res) => {
    res.send('reviews comment')
  })

}
