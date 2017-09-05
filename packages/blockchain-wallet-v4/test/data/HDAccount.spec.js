import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import { HDAccount, serializer } from '../../src/types'
chai.use(chaiImmutable)
const expect = chai.expect

const accFixture = require('../_fixtures/HDAccount/hdaccount')

describe('HDAccount', () => {
  const account = HDAccount.fromJS(accFixture, 1)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(HDAccount.toJS(account)).to.deep.equal(accFixture)
    })
  })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(account)
      const newAccount = JSON.parse(string, serializer.reviver)
      expect(newAccount).to.equal(account)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(account)
      const newAccount = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newAccount)
      expect(string2).to.equal(string)
    })
  })
})
