import { HDAccount, serializer } from './index'

const accFixture = require('./__mocks__/hdaccount')

describe('HDAccount', () => {
  const account = HDAccount.fromJS(accFixture, 1)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(HDAccount.toJS(account)).toEqual(accFixture)
    })
  })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(account)
      const newAccount = JSON.parse(string, serializer.reviver)
      expect(newAccount).toEqual(account)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(account)
      const newAccount = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newAccount)
      expect(string2).toEqual(string)
    })
  })
})
