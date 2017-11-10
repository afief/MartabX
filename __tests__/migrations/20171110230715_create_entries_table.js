
exports.up = function (knex, Promise) {
  return knex.schema.createTable('entries', (t) => {
    t.increments()
    t.integer('user_id').unsigned()
    t.string('title')
    t.timestamps()
    t.dateTime('deleted_at').nullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('entries')
}
