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

##### SIMPLE CASE
Create
```
const user = await User.create({
  name: 'Sherina Munaf'
})
```

Get By Id
```
const user = await User.find(1)
```
or by another column
```
const user = await User.find({name: 'Gista Putri'})
```
or get motiple results
```
const user = await User.finds({published: 1})
```

Update
```
const user = await User.find(1)
user.name = 'Pramaisshela Arinda Daryono Putri'
user.update()
```

Delete
```
const user = await User.find(1)
user.delete()
```

##### Extends Class
```
class UserChild extends User {
  async hardDelete () {
    const res = await context().query().where('id', this.id).delete()
    return res
  }
}
```

Using [hannibal](https://www.npmjs.com/package/hannibal) for schema
