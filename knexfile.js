'use strict';

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: "./__tests__/test.sqlite"
    },
    useNullAsDefault: true,
    migrations: {
      directory: '__tests__/migrations'
    }
  }
};