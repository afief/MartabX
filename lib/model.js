const { validate } = require('./validator')

class Model {
  constructor (knex, { table, schema = {} }) {
    this.knex = knex
    this.table = table
    this.schema = schema
  }

  query () {
    return this.knex.table(this.table)
  }

  async find (id) {
    const data = await this.query().where('id', id).first()
    return data
  }

  async create (data = {}) {
    data = validate(this.schema, data)
    if (data) {
      const id = await this.query().insert(data).returning('id')
      if (id) {
        data.id = id[0]
        return data
      }
    }
    return false
  }
}

module.exports = Model