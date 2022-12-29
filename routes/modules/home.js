const express = require('express')
const router = express.Router()

const URL = require('../../models/URL')
const shortenURL = require('../../utils/shortenURL')


router.get('/', (req, res) => {
  res.render('index')
})

//create the post route
router.post('/', async (req, res) => {
  const baseURL = req.headers.origin
  const originalURL = req.body.originalUrl
 
  try {
    const shortURL = shortenURL()

    let data // should be either the one found in database or the one gets created

    data = await URL.findOne({ originalURL })

    if(!data) {
      data = await URL.create({ shortURL, originalURL})
    }

    res.render('index', {
      origin: baseURL,
      shortURL: data.shortURL
    })
  } catch(error) {
    console.log(error)
  }
})


//redirect to the original URL
router.get('/:shortURL', async (req, res) => {
  try {
    const { shortURL } = req.params
    //find a document match to the code in req.params.shortURL
    const data = await URL.findOne({ shortURL })
    //if null
    if(!data) {
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


module.exports = router