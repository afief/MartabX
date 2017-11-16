const { validate } = require('./validator')

module.exports = function (knex, { table, schema = {}, relations = {} }, otherModels = {}) {
  class Model {
    constructor (id) {
      if (id) {
        this.id = id
      }
    }

    async setId(id) {
      this.id = id || this.id
      const data = await context().query().where('id', this.id).first()
      if (data) {
        this.setData(data)
        return true
      }
      return false
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
      const updated = await context().query().where('id', this.id).update(this)
      if (updated) {
        return true
      }
      return false
    }

    async save () {
      if (this.id) {
        return this.update()
      }
      const id = await knex.table(table).insert(this).returning('id')
      if (id) {
        this.id = id[0]
        return true
      }
      return false
    }

    async delete () {
      if (this.id) {
        const res = await context().query().where('id', this.id).update({ deleted_at: new Date })
        if (res) {
          return true
        }
      }
      return false
    }

  }

  /* Default condition */
  const defaultConditions = []
  let contextClass = false
  const context = function () {
    return contextClass !== false ? contextClass : Model
  }

  /*
  * Expose table name
  */
  Model.table = table

  /* 
  * Get knex query
  */
  Model.query = () => {
    const q = knex.table(table)

    defaultConditions.forEach((where) => {
      q.where(...where)
    })

    return q
  }

  /*
  * Get knex where
  */
  Model.where = () => {
    return context().query().where
  }

  /*
  * Count by conditions
  */
  Model.count = async (condition = {}) => {
    const q = context().query()
    applyCondition(q, condition)

    const count = await q.count()
    return count[0]['count(*)']
  }

  /* 
  * Turn object data into model class
  * @param {Object} data
  * @return {Model}
  */
  Model.compile = (data = null) => {
    function _compile(_data) {
      let modelClass = context()
      let model = new modelClass()

      model.setData(_data)
      return model
    }

    if (data) {
      if (Array.isArray(data)) {
        return data.map(_compile)
      } else {
        return _compile(data)
      }
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
    const q = context().query().where('deleted_at', null)
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
  * Get row
  * @param {Number} id / condition
  * @return {Object} row
  */
  Model.find = async (id) => {
    let condition = {id}
    if (typeof id === 'object') {
      condition = id
    }
    return context().compile(await context().query().where(condition).where('deleted_at', null).first())
  }

  /*
  * Get rows
  * @param {Number} id / condition
  * @return {Object} row
  */
  Model.finds = async (id) => {
    let condition = {id}
    if (typeof id === 'object') {
      condition = id
    }
    return context().compile(await context().query().where(condition).where('deleted_at', null).select())
  }

  /*
  * Create new row
  * @param {Object} data
  * @return {Object} new row
  */
  Model.create = async (data) => {
    defaultConditions.forEach((where) => {
      if (where.length === 2) {
        data[where[0]] = where[1]
      }
    })

    data = validate(schema, data)
    if (data) {
      data.created_at = new Date
      const id = await knex.table(table).insert(data).returning('id')
      if (id) {
        data.id = id[0]
        return context().compile(data)
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
    let condition = {id}
    if (typeof id === 'object') {
      condition = id
    }
    
    const res = await context().query().where(condition).update({ deleted_at: new Date })
    if (res) {
      return true
    }
    return false 
  }

  Model.setClass = function(cls) {
    contextClass = cls;
  }

  Model.addDefaultCondition = (where) => {
    defaultConditions.push(where)
  }

  /* Relation updates */
  if (relations.hasMany) {
    relations.hasMany.forEach(protoRelation)
  }
  function protoRelation (rel) {
    Object.defineProperty(Model.prototype, rel.name, {
      get: function () {
        if (!otherModels.hasOwnProperty(rel.model)) {
          throw new Error(`Model ${rel.model} Not Found`)
        }
        const otherModel = otherModels[rel.model]
        otherModel.addDefaultCondition([rel.foreignKey, this[rel.localKey || 'id']])
        return otherModel
      }
    })
  }

  function applyCondition (query, conditions = []) {
    if (Array.isArray(conditions)) {
      if (conditions.length > 0) {
        if (typeof conditions[0] === 'object') {
          conditions.forEach((con) => {
            applyCondition(query, con)
          })
        } else {
          query.where(...conditions)
        }
      }
    } else if (typeof conditions === 'object') {
      query.where(conditions)
    }
  }

  return Model
}
