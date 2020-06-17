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
    value: 100,
    qty: 1560,
  },
  {
    value: 200,
    qty: 975,
  },
  {
    value: 250,
    qty: 130,
  },
  {
    value: 500,
    qty: 325,
  },
  {
    value: 1000,
    qty: 58,
  },
  {
    value: 2500,
    qty: 29,
  },
  {
    value: 5000,
    qty: 11,
  },
  {
    value: 25000,
    qty: 1,
  },
]

const getRandom = async () => {
  let array = Array(26000)
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
