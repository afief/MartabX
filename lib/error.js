module.exports = class MartabXError extends Error {
  constructor (message, detail, statusCode = 400) {
    super(`${message}`)
    this.code = statusCode
    this.detail = detail
  }
}
