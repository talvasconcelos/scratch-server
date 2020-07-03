require('dotenv').config()
const hash = require('../../utils')
const { v4: uuidv4 } = require('uuid')
const Mongoose = require('mongoose')
const Ticket = require('./ticketModel')

const mongoURI = process.env.MURI
Mongoose.Promise = global.Promise

Mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  auth: {
    user: process.env.MUSER,
    password: process.env.MPASS,
  },
})

const conn = Mongoose.connection

conn.on('error', console.error.bind(console, 'connection error:'))

conn.once('open', async () => {
  console.log('The Mongoose connection is ready')
  getRandom()
    .then(res => {
      return res.map(c => {
        tickets.push({
          internal_id: c,
          endpoint: hash.encrypt(c),
          prize: 0,
          status: true,
        })
      })
    })
    .then(() => {
      prizes.map(c => setPrizes(c))
      return
    })
    .then(() => addTicket())
})

const tickets = []
const prizes = [
  {
    value: 10000,
    qty: 17,
  },
  {
    value: 25000,
    qty: 5,
  },
  {
    value: 50000,
    qty: 2,
  },
  {
    value: 100000,
    qty: 1,
  }
]

const getRandom = async () => {
  let array = Array(100)
    .fill(0)
    .map(c => (c = uuidv4()))
  //let array = new Uint16Array(35000).map((c, i, arr) => (arr[i] = uuidv4()))
  // console.log(array);
  return array
}

async function setPrizes({ value, qty }) {
  let i = 0
  while (i < qty) {
    let rnd = tickets[(Math.random() * tickets.length) >> 0]
    if (!rnd.prize) {
      rnd.prize = value
      i++
    }
  }
  return
}

async function addTicket() {
  try {
    await Ticket.collection.insertMany(tickets)
    console.log('inserted')
  } catch (e) {
    console.error(e)
  }
}