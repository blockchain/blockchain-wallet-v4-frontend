import chai from 'chai'
import chaiImmutable from 'chai-immutable'
import { AddressLabel, serializer } from '../../src/types'
const { expect } = chai
chai.use(chaiImmutable)

describe('AddressLabel', () => {
  const addressLabelFixture = require('../_fixtures/AddressLabel/address-label')
  const addressLabel = AddressLabel.fromJS(addressLabelFixture)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(AddressLabel.toJS(addressLabel)).to.deep.equal(addressLabelFixture)
    })
  })

  describe('properties', () => {
    it('should have index', () => {
      expect(addressLabel.index).to.equal(addressLabelFixture.index)
    })

    it('should have label', () => {
      expect(addressLabel.label).to.equal(addressLabelFixture.label)
    })
  })

  describe('setLabel', () => {
    it('should set the label of an addressLabel object', () => {
      let withNewLabel = AddressLabel.setLabel('new_label', addressLabel)
      expect(withNewLabel.label).to.equal('new_label')
    })
  })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(addressLabel)
      const newAddrLabel = JSON.parse(string, serializer.reviver)
      expect(newAddrLabel).to.equal(addressLabel)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(addressLabel)
      const newAddrLabel = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newAddrLabel)
      expect(string2).to.equal(string)
    })
  })
})
