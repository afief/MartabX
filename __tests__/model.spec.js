/* global describe it expect */
const User = require('./models/User')
const faker = require('faker')

describe('Save modified model', () => {
  it('Should successfully save with unrecognized additional parameter', async () => {
    const name = faker.name.findName()
    const name2 = faker.name.findName()
    const user = await User.create({
      name
    })

    user.name = name2
    user.illegalParams = 'illegal value'
    user.updated_at = new Date()
    await user.save()

    expect(!isNaN(user.id)).toBe(true)
    expect(user.name).toBe(name2)
    expect(user.created_at).toBeTruthy()
  })
})
