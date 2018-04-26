import * as crypto from './'
import data from './wallet-data.json'

describe('WalletCrypto', () => {
  // describe('decryptWallet', () => {
  //   it('should decrypt a v3 wallet', () => {
  //     let decrypted = crypto.decryptWallet('mypassword', data.v3)
  //     expect(decrypted.isRight).toEqual(true)
  //     expect(decrypted.value.guid).toEqual('e01a59a0-31f2-4403-8488-32ffd8fdb3cc')
  //   })

  //   it('should decrypt a v2 wallet', () => {
  //     let decrypted = crypto.decryptWallet('mypassword', data.v2)
  //     expect(decrypted.isRight).toEqual(true)
  //     expect(decrypted.value.guid).toEqual('40f09ca9-4a94-47ad-b9c8-47d4bbacef5e')
  //   })

  //   it('should decrypt a v1 wallet', () => {
  //     let decrypted = crypto.decryptWallet('mypassword', data.v1)
  //     expect(decrypted.isRight).toEqual(true)
  //     expect(decrypted.value.guid).toEqual('5b0e3243-1e61-40d5-bd0e-3c1e5dfcda48')
  //   })
  // })

////////////////////////////////////////////////////////////////////////////////

  describe('de/encryptDataWithPassword composition', () => {
    it('should be the identity', () => {
      let message = '155 is a bad number'
      crypto.encryptDataWithPassword(message, '1714', 11)
        .chain(msg => crypto.decryptDataWithPassword(msg, '1714', 11))
        .fork(
          failure => expect(failure).toEqual(undefined),
          text => expect(text).toEqual(message))
    })
  })

  describe('encryptDataWithPassword', () => {
    it('should not accept null password', () => {
      let message = '155'
      crypto.encryptDataWithPassword(message, null, 11)
        .fork(
          failure => expect(failure).toEqual('password_required'),
          text => expect(text).toEqual('this-branch-should-not-run'))
    })
  })

  describe('encryptDataWithPassword', () => {
    it('should not accept bad iterations', () => {
      let message = '155'
      crypto.encryptDataWithPassword(message, '155', -100)
        .fork(
          failure => expect(failure).toEqual('iterations_required'),
          text => expect(text).toEqual('this-branch-should-not-run'))
    })
  })

  describe('decryptDataWithPassword', () => {
    it('should not accept encrypted messages without the salt', () => {
      crypto.decryptDataWithPassword('message-without-salt', '1714', 11)
        .fork(
          failure => expect(failure.message).toBeTruthy(),
          text => expect(text).toEqual('this-branch-should-not-run'))
    })
  })

  describe('decryptWalletV1', () => {
    it('should decrypt the wallet correctly', () => {
      crypto.decryptWalletV1('mypassword', data.v1)
        .fork(
          failure => expect(failure).toEqual('this-branch-should-not-run'),
          wallet => expect(wallet.guid).toEqual('5b0e3243-1e61-40d5-bd0e-3c1e5dfcda48'))
    })
  })

  // describe('decryptWalletV2V3', () => {
  //   it('should decrypt the wallet correctly', () => {
  //     crypto.decryptWalletV2V3('mypassword', data.v2)
  //       .fork(
  //         failure => expect(failure).toEqual('this-branch-should-not-run'),
  //         wallet => expect(1).toEqual(1)
  //       )
  //   })
  // })
})
