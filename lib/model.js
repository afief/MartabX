const { validate } = require('./validator')

module.exports = function (knex, { table, schema = {} }) {
  class Model {
    constructor (id) {
      this.id = id
    }
  }

  Model.query = () => knex.table(table)

  /*
  * Get row by id
  * @param {Number} id
  * @return {Object} row
  */
  Model.find = async (id) => {
    const result = await Model.query().where('id', id).first()
    return result
  }

  /*
  * Create new row
  * @param {Object} data
  * @return {Object} new row
  */
  Model.create = async (data) => {
    data = validate(schema, data)
    if (data) {
      data.created_at = knex.fn.now()
      const id = await Model.query().insert(data).returning('id')
      if (id) {
        data.id = id[0]
        return data
      }
    }
    return false
  }

  return Model
}
