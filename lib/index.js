const Model = require('./model')
let instance = false

class MartabX {
  constructor (knex) {
    this.knex = knex
    this.models = {}
  }
  model (name, config) {
    if (this.models.hasOwnProperty(name)) {
      return false
    }
    this.models[name] = new Model(this.knex, config)
    return this.models[name]
  }
}

module.exports = function (knex) {
  if (!instance) {
    instance = new MartabX(knex)
  }
  return instance
}