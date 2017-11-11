const { validate } = require('./validator')

module.exports = function (knex, { table, schema = {}, relations = {} }, otherModels = {}) {
  class Model {
    constructor () {
    }

    setData (data) {
      for (var k in data) {
        this[k] = data[k]
      }
    }

    async update (data) {
      if (!this.id) {
        return this.save()
      }
      this.updated_at = new Date
      const updated = await Model.query().where('id', this.id).update(this)
      if (updated) {
        return true
      }
      return false
    }

    async save () {
      if (this.id) {
        return this.update()
      }
      const id = await Model.query().insert(this).returning('id')
      if (id) {
        this.id = id[0]
        return true
      }
      return false
    }

    async delete () {
      if (this.id) {
        const res = await Model.query().where('id', this.id).update({ deleted_at: new Date })
        if (res) {
          return true
        }
      }
      return false
    }

  }

  /* Default condition */
  const wheres = []

  /*
  * Expose table name
  */
  Model.table = table

  /* 
  * Get knex query
  */
  Model.query = () => {
    const q = knex.table(table)

    wheres.forEach((where) => {
      q.where(...where)
    })

    return q
  }

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
  * Get all data
  * @param {Number} limit
  * @param {Number} offset
  * @return {Object} rows
  */
  Model.all = async (limit = false, offset = 0) => {
    const q = Model.query().where('deleted_at', null)
    if (limit) {
      q.limit(limit)
    }
    if (offset) {
      q.offset(offset)
    }
    const result = await q.select()
    return result
  }

  /*
  * Get row by id
  * @param {Number} id
  * @return {Object} row
  */
  Model.find = async (id) => {
    return Model.compile(await Model.query().where('id', id).where('deleted_at', null).first())
  }

  /*
  * Create new row
  * @param {Object} data
  * @return {Object} new row
  */
  Model.create = async (data) => {
    data = validate(schema, data)
    if (data) {
      data.created_at = new Date
      const id = await Model.query().insert(data).returning('id')
      if (id) {
        data.id = id[0]
        return Model.compile(data)
      }
    }
    return null
  }

  /*
  * Delete  row
  * @param {Number} id
  * @return {Boolean}
  */
  Model.delete = async (id) => {
    if (id) {
      const res = await Model.query().where('id', id).update({ deleted_at: new Date })
      if (res) {
        return true
      }
    }
    return false 
  }

  Model.addDefaultCondition = (...where) => {
    wheres.push(where)
  }


  /* Relation updates */
  if (relations.hasMany) {
    relations.hasMany.forEach(protoRelation)
  }
  function protoRelation(rel) {
    Object.defineProperty(Model.prototype, rel.name, {
      get: function () {
        if (!otherModels.hasOwnProperty(rel.model)) {
          throw new Error(`Model ${rel.model} Not Found`)
        }
        const otherModel = otherModels[rel.model]
        const condition = {}
        condition[rel.foreignKey] = this[rel.localKey || 'id']

        otherModel.addDefaultCondition(condition)
        return otherModel
      }
    })
  }

  return Model
}
