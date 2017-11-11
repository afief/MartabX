const Hannibal = require('hannibal')

const validate = function (schema, data) {
  const hannibal = new Hannibal()
  const val = hannibal.create({schema})
  const result = val(data)

  if (result.isValid) {
    return result.data
  }
  return null
}

module.exports = {
  validate
}
