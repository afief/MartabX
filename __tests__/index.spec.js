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

    currentUser = user
  })

  it('Read : Success', async () => {
    const user = await User.find(currentUser.id)

    console.log(user)

    expect(!isNaN(user.id)).toBe(true)
  })
})