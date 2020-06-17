require('dotenv').config()
const polka = require('polka')
const { json, urlencoded } = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const Ticket = require('./api/models/ticketModel')
const routes = require('./api/routes/ticketRoutes')
const { PORT = 3000 } = process.env

const app = polka()

// mongoose instance connection url connection
mongoose.Promise = global.Promise
mongoose.connect(process.env.MURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  auth: {
    user: process.env.MUSER,
    password: process.env.MPASS,
  },
})

app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(json())
routes(app)

app.listen(PORT, err => {
  if (err) throw err
  console.log(`> Running on localhost:${PORT}`)
})
