# MartabX

#### Knex Super Model

```
npm install martabx --save
```

##### Create Model
```
const MartabX = require('martabx')(knex)

const User = MartabX.model('User', {
  table: 'users',
  schema: {
    name: {
      type: 'string',
      required: true
    }
  }
})
```
Using [hannibal](https://www.npmjs.com/package/hannibal) for schema
