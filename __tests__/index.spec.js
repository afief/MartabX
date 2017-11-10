/* global describe it */
const User = require('./models/User')
const Entry = require('./models/Entry')

describe('Test', () => {
  it('Success', async () => {
    
    const rowId = await User.create({
      name: (+new Date()).toString()
    })
    console.log('row id', rowId)
    
  })
})