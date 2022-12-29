const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const URL = require('./models/URL')
const shortenURL = require('./utils/shortenURL')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URI)

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  res.render('index')
})


app.post('/', (req, res) => {
  const baseURL = req.headers.origin
  const originalURL = req.body.originalUrl
  const shortURL = shortenURL()

  if (!originalURL) return res.redirect('/')

  URL.findOne({ originalURL })
    .then(data => 
      // console.log(data)
      data ? data : URL.create({ shortURL, originalURL })
    )
    .then(data =>
      // console.log(data)
      res.render('index', {
        origin: baseURL,
        shortURL: data.shortURL,
      })
    )
    .catch(error => console.log(error))
})



app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})