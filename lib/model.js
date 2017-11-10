class Model {
  constructor (knex, { table, editable = [] }) {
    this.knex = knex
    this.table = table
    this.editable = editable
  }

  query () {
    return this.knex.table(this.table)
  }

  async find (id) {
    const res = await this.query().where('id', id).first()
  }
}

module.exports = Model