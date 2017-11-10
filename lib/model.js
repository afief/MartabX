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
    const res = await this.query().where('id', id).first()
  }

  async create (data) {
    data = validate(this.schema, data)
    if (data) {
      const result = await this.query().insert(data).returning('id')
      return result
    }
  }
}

module.exports = Model