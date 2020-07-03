'use strict'
module.exports = app => {
  const ticketList = require('../controllers/ticketController')

  // todoList Routes
  app.get('/tickets', ticketList.list_all_tickets)

  app.get('/tickets/invoice/:bet', ticketList.get_invoice)

  app.get('/tickets/invoice/:invoice_id/:ticketID', ticketList.check_invoice)

  app.get('/tickets/:ticketURL', ticketList.read_a_ticket)
}
