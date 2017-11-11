const { validate } = require('./validator')

module.exports = function (knex, { table, schema = {} }) {
  class Model {
    constructor (id) {
      this.id = false
      if (id) {
        this.id = id
      }
    }

    setData (data) {
      for (var k in data) {
        this[k] = data[k]
      }
    }

    async update (data) {
      if (!this.id) {
        this.save()
      }
      const updated = await Model.query().where('id', this.id).update(this)
      if (updated) {
        return true
      }
      return false
    }

    async save () {
      if (this.id) {
        this.update()
      }
      const id = await Model.query().insert(this).returning('id')
      if (id) {
        this.id = id[0]
        return true
      }
      return false
    }

  }

  Model.query = () => knex.table(table)

  /* 
  * Turn object data into model class
  * @param {Object} data
  * @return {Model}
  */
  Model.compile = (data = null) => {
    if (data) {
      const model = new Model()
      model.setData(data)
      return model
    }
    return null
  }

  /*
  * Get row by id
  * @param {Number} id
  * @return {Object} row
  */
  Model.find = async (id) => {
    return Model.compile(await Model.query().where('id', id).first())
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
        return Model.compile(data)
      }
    }
    return null
  }

  return Model
}
