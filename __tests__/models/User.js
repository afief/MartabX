const knex = require('../DB.js')
const MartabX = require('../../lib/index.js')(knex)

const User = MartabX.model('User', {
  table: 'users',
  schema: {
    name: {
      type: 'string',
      required: true
    },
    updated_at: {
      type: 'date'
    }
  }
})

module.exports = User
