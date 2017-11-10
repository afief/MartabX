const knex = require('../DB.js')
const MartabX = require('../../lib/index.js')(knex)

const Entry = MartabX.model('Entry', {
  table: 'entries',
  editable: ['user_id', 'title']
})

module.exports = Entry