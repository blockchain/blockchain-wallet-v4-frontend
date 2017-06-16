import chai from 'chai'
import chaiImmutable from 'chai-immutable'

import { Address, serializer } from '../../src/types'
import * as crypto from '../../src/WalletCrypto'
const { expect } = chai
chai.use(chaiImmutable)
import { Map, List } from 'immutable-ext'

describe('Address', () => {
  const addressFixture = { priv: '5priv', addr: '1addr' }
  const address = Address.fromJS(addressFixture)

  crypto.encryptDataWithKey = (data, key, iv) => `enc<${data}>`

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(Address.toJS(address)).to.deep.equal(addressFixture)
    })
  })

  describe('properties', () => {
    it('should have priv', () => {
      expect(address.priv).to.equal(addressFixture.priv)
    })

    it('should have addr', () => {
      expect(address.addr).to.equal(addressFixture.addr)
    })
  })

  describe('setLabel', () => {
    it('should set the label of an address object', () => {
      let withNewLabel = Address.setLabel('new_label', address)
      expect(address.label).to.equal(void 0)
      expect(withNewLabel.label).to.equal('new_label')
    })
  })

  describe('encryptSync', () => {
    it('should return an encrypted Address', () => {
      let encrypted = Address.encryptSync(1, null, 'secret', address)
      expect(encrypted.isRight).to.equal(true)
      expect(encrypted.value.priv).to.equal('enc<5priv>')
    })
  })
  describe('serializer: ', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const ser = JSON.stringify(address, serializer.replacer)
      const unser = JSON.parse(ser, serializer.reviver)
      expect(unser).to.deep.equal(address)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const ser = JSON.stringify(address, serializer.replacer)
      const unser = JSON.parse(ser, serializer.reviver)
      const ser2 = JSON.stringify(unser, serializer.replacer)
      expect(ser).to.equal(ser2)
    })
  })
})
