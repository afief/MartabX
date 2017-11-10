const Model = require('./model')
const instance = false

class MartabX {
  constructor (knex) {
    this.models = {}
  }
  model (name, config) {
    if (this.models.hasOwnProperty(name)) {
      return false
    }
    this.models[name] = new Model(knex, config)
  }
}

module.exports = function (knex) {
  if (!instance) {
    instance = new MartabX(knex)
  }
  return instance
}