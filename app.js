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

//create the post route
app.post('/', async (req, res) => {
  const baseURL = req.headers.origin
  const originalURL = req.body.originalUrl

  //check URL if valid
  if (!originalURL) return res.redirect('/')
  //if valid, create the shortURL code
  const shortURL = shortenURL()

  try {
      const data = await URL.findOne({ originalURL })

      if(!data) {
        await URL.create({ shortURL, originalURL })
      }
      res.render('index', {
        origin: baseURL, 
        shortURL: data.shortURL,
      })
    } catch (error) {
    console.log(error)
    }
    // .then(data => 
    //   data ? data : URL.create({ shortURL, originalURL })
    // )
    // .then(data =>
    //   res.render('index', {
    //     origin: baseURL,
    //     shortURL: data.shortURL,
    //   })
    // )
    // .catch(error => console.log(error))
})


//redirect to the original URL
app.get('/:shortURL', async (req, res) => {
  try{
      const { shortURL } = req.params
      //find a document match to the code in req.params.shortURL
      const data = await URL.findOne({ shortURL })
      //if null
      if(!data) {
        console.log(req.headers)
        return res.render('error', {
          errorURL: "http://" + req.headers.host + "/" + shortURL
        })
      }
      //else: redirect the user to original link
      res.redirect(data.originalURL)
    } catch (error) {
      console.log(error)
    }
  })


app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})