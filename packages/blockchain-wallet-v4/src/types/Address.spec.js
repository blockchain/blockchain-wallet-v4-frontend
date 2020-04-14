import * as crypto from '../walletCrypto/index'
import { Address, serializer } from './index'

describe('Address', () => {
  const addressFixture = { priv: '5priv', addr: '1addr' }
  const address = Address.fromJS(addressFixture)
  crypto.encryptDataWithKey = (data, key, iv) => `enc<${data}>`

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(Address.toJS(address)).toEqual(addressFixture)
    })
  })

  describe('properties', () => {
    it('should have priv', () => {
      expect(address.priv).toEqual(addressFixture.priv)
    })

    it('should have addr', () => {
      expect(address.addr).toEqual(addressFixture.addr)
    })
  })

  describe('setLabel', () => {
    it('should set the label of an address object', () => {
      let withNewLabel = Address.setLabel('new_label', address)
      expect(address.label).toEqual(void 0)
      expect(withNewLabel.label).toEqual('new_label')
    })
  })

  // describe('encrypt', () => {
  //   it('should return an encrypted Address', done => {
  //     Address.encrypt(1, null, 'secret', address).fork(done, enc => {
  //       expect(enc.priv).not.toEqual(addressFixture.priv)
  //       done()
  //     })
  //   })
  // })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(address)
      const newAddress = JSON.parse(string, serializer.reviver)
      expect(newAddress).toEqual(address)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(address)
      const newAddress = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newAddress)
      expect(string).toEqual(string2)
    })
  })
})
