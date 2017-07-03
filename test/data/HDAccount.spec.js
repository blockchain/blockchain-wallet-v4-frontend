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

  describe('setAddressLabel', () => {
    it('should change an existing address label', () => {
      let label = 'changed_label'
      let newAccount = HDAccount.setAddressLabel(0, label, account)
      expect(HDAccount.toJS(newAccount).address_labels[0].label).to.equal(label)
    })

    it('should add a new address label', () => {
      let label = 'new_label'
      let newAccount = HDAccount.setAddressLabel(1, label, account)
      expect(HDAccount.toJS(newAccount).address_labels[1].label).to.equal(label)
    })
  })

  describe('removeAddressLabel', () => {
    it('should remove an address label', () => {
      let newAccount = HDAccount.removeAddressLabel(0, account)
      expect(HDAccount.toJS(newAccount).address_labels).to.have.length.of(0)
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
