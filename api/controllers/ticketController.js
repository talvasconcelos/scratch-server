'use strict'
global.fetch = require('node-fetch')
const mongoose = require('mongoose')
const Ticket = mongoose.model('Ticket')
const hash = require('../../utils')
const price = 10000

exports.list_all_tickets = (req, res) => {
  Ticket.aggregate()
    .match({ status: true }) //.find({}, { internal_id: 0, value: 0, endpoint: 0, prize: 0 })
    .sample(30)
    //.limit(250)
    //.toArray()
    .exec((err, tickets) => {
      if (err) {
        res.end(err)
        console.error(err)
        return
      }
      // console.log(tickets)
      res.end(
        JSON.stringify(
          tickets.map(f => f._id) //.map(f => ({ endpoint: f.endpoint }))
        )
      )
    })
}

exports.read_a_ticket = async (req, res) => {
  const id = hash.decrypt(req.params.ticketURL)
  if (!id) return res.end('Error with endpoint!')
  Ticket.findOneAndUpdate(
    { internal_id: id, status: true },
    { status: false },
    { new: true },
    async (err, ticket) => {
      if (err || !ticket)
        return (
          (res.statusCode = 401),
          res.end(JSON.stringify({ error: 'No ticket with that ID!' }))
        )
      const tick = ticket.toObject()
      delete tick.status
      delete tick.endpoint
      delete tick.internal_id
      if (tick.prize) {
        tick.lnurl = await getLNURL(tick.prize)
        res.end(JSON.stringify(tick))
        return
      }
      res.end(JSON.stringify(tick))
    }
  )
}

exports.get_invoice = (req, res) => {
  const value = req.params.bet
  if (value !== price) {
    res.end(JSON.stringify({ hack: true }))
    return
  }
  getInvoice(value)
    .then(invoice => {
      res.end(JSON.stringify(invoice))
    })
    .catch(e => console.error(e))
}

exports.check_invoice = async (req, res) => {
  const invoice_id = req.params.invoice_id
  const card_id = req.params.ticketID

  const response = await fetch(`https://lnpay.co/v1/lntx/${invoice_id}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': process.env.LNAPI,
      'Content-Type': 'application/json',
    },
  })
  const { settled } = await response.json()
  if (!settled) {
    return res.end(JSON.stringify({ settled, url: '' }))
  }

  Ticket.findById(card_id, (err, ticket) => {
    if (err || !ticket)
      return (
        (res.statusCode = 401),
        res.end(JSON.stringify({ error: 'No ticket with that ID!' }))
      )
    res.end(JSON.stringify({ settled: true, url: ticket.toObject().endpoint }))
  })
}

async function getLNURL(sats) {
  try {
    const response = await fetch(
      `https://lnpay.co/v1/wallet/${process.env.LNKEY}/lnurl/withdraw?num_satoshis=${sats}`,
      {
        method: 'GET',
        headers: {
          'X-Api-Key': process.env.LNAPI,
          'Content-Type': 'application/json',
        },
      }
    )
    const body = await response.json()
    console.log(body)
    return body.lnurl
  } catch (e) {
    console.error(e)
  }
}

async function getInvoice(value) {
  try {
    const response = await fetch(
      `https://lnpay.co/v1/wallet/${process.env.LNKEY}/invoice`,
      {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.LNAPI,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          num_satoshis: value,
          memo: 'Scratch to win!',
        }),
      }
    )
    const body = await response.json()
    return { id: body.id, invoice: body.payment_request.toUpperCase() }
  } catch (e) {
    throw new Error(e)
  }
}

function fuckYou() {
  let i = 1n;
  let x = 3n * (10n ** 1000020n);
  let pi = x;
  while (x > 0) {
    x = x * i / ((i + 1n) * 4n);
    pi += x / (i + 2n);
    i += 2n;
  }
  console.log(pi / (10n ** 20n));
}
