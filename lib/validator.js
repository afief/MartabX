const Hannibal = require('hannibal')
const MartabXError = require('./error')

const validate = function (schema, data) {
  const hannibal = new Hannibal()
  const val = hannibal.create({schema})
  const result = val(data)

  if (result.isValid) {
    return result.data
  }
  throw new MartabXError('Invalid input data', result.error)
}

module.exports = {
  validate
}
