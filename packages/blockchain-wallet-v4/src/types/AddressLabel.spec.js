import { AddressLabel, serializer } from './index'

describe('AddressLabel', () => {
  const addressLabelFixture = require('./__mocks__/address-label')
  const addressLabel = AddressLabel.fromJS(addressLabelFixture)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(AddressLabel.toJS(addressLabel)).toEqual(addressLabelFixture)
    })
  })

  describe('properties', () => {
    it('should have index', () => {
      expect(addressLabel.index).toEqual(addressLabelFixture.index)
    })

    it('should have label', () => {
      expect(addressLabel.label).toEqual(addressLabelFixture.label)
    })
  })

  describe('setLabel', () => {
    it('should set the label of an addressLabel object', () => {
      let withNewLabel = AddressLabel.setLabel('new_label', addressLabel)
      expect(withNewLabel.label).toEqual('new_label')
    })
  })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(addressLabel)
      const newAddrLabel = JSON.parse(string, serializer.reviver)
      expect(newAddrLabel).toEqual(addressLabel)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(addressLabel)
      const newAddrLabel = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newAddrLabel)
      expect(string2).toEqual(string)
    })
  })
})
