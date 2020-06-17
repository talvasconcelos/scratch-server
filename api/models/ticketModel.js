const mongoose = require('mongoose')
const Schema = mongoose.Schema

var TicketSchema = new Schema({
  internal_id: String,
  status: { type: Boolean, default: true },
})

module.exports = mongoose.model('Ticket', TicketSchema)
