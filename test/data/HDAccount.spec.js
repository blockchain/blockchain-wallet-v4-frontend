import chai from 'chai'
import chaiImmutable from 'chai-immutable'
chai.use(chaiImmutable)
import { HDAccount, serializer } from '../../src/types'
const expect = chai.expect
import * as R from 'ramda'
import { List, Map } from 'immutable-ext'

const accFixture = require('../_fixtures/HDAccount/hdaccount')

describe('HDAccount', () => {
  const account = HDAccount.fromJS(accFixture)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(HDAccount.toJS(account)).to.deep.equal(accFixture)
    })
  })

  describe('serializer: ', () => {
    // it('compose(reviver, replacer) should be identity', () => {
    //   const ser = JSON.stringify(account, serializer.replacer)
    //   const unser = JSON.parse(ser, serializer.reviver)
    //   // when we have a type Immutable(js(Imutabable())) this comparison does not work
    //   expect(account).to.eql(unser)
    // })
    it('compose(replacer, reviver) should be identity', () => {
      const ser = JSON.stringify(account, serializer.replacer)
      const unser = JSON.parse(ser, serializer.reviver)
      const ser2 = JSON.stringify(unser, serializer.replacer)
      expect(ser).to.equal(ser2)
    })
  })
})
