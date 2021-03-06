/* global describe it expect */
const User = require('./models/User')
const faker = require('faker')

describe('Basic CRUD', () => {
  describe('Success Story', () => {
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

      expect(!isNaN(user.id)).toBe(true)
      expect(user.name).toBe(currentUser.name)
    })

    it('Update : Success', async () => {
      const newName = faker.name.findName()

      const user = await User.find(currentUser.id)
      user.name = newName
      const result = await user.update()

      expect(result).toBeTruthy()
      expect(user.name).toBe(newName)

      currentUser = user
    })

    it('Delete : Success', async () => {
      const newName = faker.name.findName()

      const user = await User.find(currentUser.id)
      user.name = newName
      const result = await user.delete()

      expect(result).toBe(true)

      const oldUser = await User.find(currentUser.id)
      expect(oldUser).toBe(null)
    })
  })

  describe('Failed Story', () => {
    it('Failed to create row due to empty column', async () => {
      const user2 = await User.create()
      expect(user2).toBe(null)
    })

    it('Failed to create row due to invalid column', async () => {
      try {
        await User.create({
          nama: faker.name.findName()
        })
      } catch (e) {
        expect(e.message).toBeTruthy()
      }
    })

    it('Failed to get row due to id not found', async() => {
      const user = await User.find(faker.random.number(10000, 20000))
      expect(user).toBe(null)
    })

    it('Failed to get row due to id not a number', async() => {
      const user = await User.find(faker.address.city())
      expect(user).toBe(null)
    })

    it('Allow invalid parameter', async() => {
      const user = await User.create({
        name: faker.name.findName()
      })
      user.address = faker.address.streetName()

      let result = await user.update()
      expect(result).toBeTruthy()
    })

    it('Failed to delete row due to id not found', async() => {
      const result = await User.delete(faker.random.number(10000, 20000))
      expect(result).toBe(false)
    })

    it('Get deleted on find', async () => {
      const name = faker.name.findName()
      const user = await User.create({
        name
      })
      await user.delete()

      const getActive = await User.find(user.id)
      expect(getActive).toBeFalsy()

      const getDeleted = await User.find(user.id, true)
      expect(getDeleted).toBeTruthy()
    })
  })
})
