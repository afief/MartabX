
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (t) => {
    t.increments()
    t.string('name')
    t.timestamps()
    t.dateTime('deleted_at').nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users')
}
