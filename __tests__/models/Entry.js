const knex = require('../DB.js')
const MartabX = require('../../lib/index.js')(knex)

const Entry = MartabX.model('Entry', {
  table: 'entries',
  schema: {
    user_id: {
      type: 'number',
      required: true
    },
    title: {
      type: 'string',
      required: true
    }
  }
})

module.exports = Entry