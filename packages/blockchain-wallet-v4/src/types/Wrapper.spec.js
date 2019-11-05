import { serializer, Wrapper } from './index'

const wrapperFixture = require('./__mocks__/wrapper.v3')

describe('Wrapper', () => {
  const myWrapper = Wrapper.fromJS(wrapperFixture)

  describe('serializer', () => {
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(myWrapper)
      const newWrapper = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newWrapper)
      expect(string2).toEqual(string)
    })
  })
})
