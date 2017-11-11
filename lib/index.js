const model = require('./model')
let instance = false

class MartabX {
  constructor (knex) {
    this.knex = knex
    this.models = {}
  }
  model (name, config) {
    if (this.models.hasOwnProperty(name)) {
      return this.models[name]
    }
    this.models[name] = model(this.knex, config, this.models)
    return this.models[name]
  }
}

module.exports = function (knex) {
  if (!instance) {
    instance = new MartabX(knex)
  }
  return instance
}
