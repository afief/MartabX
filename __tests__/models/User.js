const knex = require('../DB.js')
const MartabX = require('../../lib/index.js')(knex)

const User = MartabX.model('User', {
  table: 'users',
  editable: ['name']
})

module.exports = User