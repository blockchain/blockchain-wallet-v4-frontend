import * as WalletCrypto from './'
import data from './wallet-data.json'

describe('WalletCrypto', () => {
  describe('decryptWallet', () => {
    it('should decrypt a v3 wallet', () => {
      let decrypted = WalletCrypto.decryptWallet('mypassword', data.v3)
      expect(decrypted.isRight).toEqual(true)
      expect(decrypted.value.guid).toEqual('e01a59a0-31f2-4403-8488-32ffd8fdb3cc')
    })

    it('should decrypt a v2 wallet', () => {
      let decrypted = WalletCrypto.decryptWallet('mypassword', data.v2)
      expect(decrypted.isRight).toEqual(true)
      expect(decrypted.value.guid).toEqual('40f09ca9-4a94-47ad-b9c8-47d4bbacef5e')
    })

    it('should decrypt a v1 wallet', () => {
      let decrypted = WalletCrypto.decryptWallet('mypassword', data.v1)
      expect(decrypted.isRight).toEqual(true)
      expect(decrypted.value.guid).toEqual('5b0e3243-1e61-40d5-bd0e-3c1e5dfcda48')
    })
  })
})
