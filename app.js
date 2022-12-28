const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

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


app.post('/', async (req, res) => {
 //若使用者沒有輸入內容，就按下了送出鈕，需要防止表單送出並提示使用者
 if (!req.body.url) return res.redirect('/')
 const originalUrl = req.body.originalUrl 

})

app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`)
})