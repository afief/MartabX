/* global describe it expect */
const User = require('./models/User')
const Entry = require('./models/Entry')
const faker = require('faker')

describe('Basic CRUD', () => {
  let currentUser = null

  it('Create : Success', async () => {
    const name = faker.name.findName()
    const user = await User.create({
      name
    })

    expect(!isNaN(user.id)).toBe(true)
    expect(user.name).toBe(name)
    expect(user.created_at).toBeTruthy()

    currentUser = user
  })

  it('Read : Success', async () => {
    const user = await User.find(currentUser.id)

    console.log(user)

    expect(!isNaN(user.id)).toBe(true)
  })

  it('Update : Success', async () => {
    const currentName = currentUser.name
    const newName = faker.name.findName()

    const user = await User.find(currentUser.id)
    user.name = newName
    const result = await user.update()

    expect(result).toBe(true)
    expect(user.name).toBe(newName)
  })
})
