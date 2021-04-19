import { repeat } from 'ramda'

import * as wCrypto from './'
import * as U from './utils'
import data from './wallet-data.json'

describe('WalletCrypto', () => {
  describe('safeParse', () => {
    it('return a success task', done => {
      let myTask = wCrypto.safeParse('{"article":155}')
      myTask.fork(done, object => {
        expect(object.article).toEqual(155)
        done()
      })
    })
  })

  describe('isStringHashInFraction', () => {
    it('should be in the fraction', () => {
      let res = wCrypto.isStringHashInFraction(
        '001a59a0-31f2-4403-8488-32ffd8fdb3cc',
        0.5
      )
      expect(res).toBeTruthy()
    })
  })

  describe('(de)encryptDataWithKey', () => {
    it('composition should be the identity', () => {
      let key = wCrypto.sha256('mykey')
      let iv = Buffer.from(repeat(3, 16))
      let message = 'hello'
      let encrypted = wCrypto.encryptDataWithKey(message, key, iv, null)
      let decrypted = wCrypto.decryptDataWithKey(encrypted, key, iv)
      expect(decrypted).toBe(message)
    })
  })

  describe('de/encryptDataWithPassword composition', () => {
    it('should be the identity', done => {
      let message = '155 is a bad number'
      wCrypto
        .encryptDataWithPassword(message, '1714', 11)
        .chain(msg =>
          wCrypto.decryptDataWithPassword(msg, '1714', 11, { mode: U.AES.CBC })
        )
        .fork(done, text => {
          expect(text).toEqual(message)
          done()
        })
    })
  })

  describe('encryptDataWithNullPassword', () => {
    it('should not accept null password', done => {
      let message = '155'
      wCrypto.encryptDataWithPassword(message, null, 11).fork(failure => {
        expect(failure).toEqual('password_required')
        done()
      }, done)
    })
    it('should not accept bad iterations', done => {
      let message = '155'
      wCrypto.encryptDataWithPassword(message, '155', -100).fork(failure => {
        expect(failure).toEqual('iterations_required')
        done()
      }, done())
    })
  })

  describe('decryptDataWithPassword no salt', () => {
    it('should not accept encrypted messages without the salt', done => {
      wCrypto
        .decryptDataWithPassword('message-without-salt', '1714', 11)
        .fork(failure => {
          expect(failure.message).toBeTruthy()
          done()
        }, done)
    })
  })

  describe('sha256', () => {
    it('should work as expected', () => {
      let hash = wCrypto.sha256('Remember remember, the 1st of October of 2017')
      expect(hash.toString('hex')).toBe(
        '0de04ad2dce00c0124c6d0fc8c0ea15b6e97e2810c246d4c1e5129be714082c7'
      )
    })
  })

  describe('stretchPassword', () => {
    it('should stretch the password', done => {
      wCrypto.stretchPassword('mypassword', 'salt', 10, 256).fork(done, res => {
        expect(res.toString('hex')).toEqual(
          'bfa4bc6a1b049170dfa00ccfa7bdf542b15f014f544026dbbb676499e8344dcc'
        )
        done()
      })
    })
    it('should fail with no iterations', done => {
      wCrypto.stretchPassword('mypassword', 'salt', 0, 256).fork(res => {
        expect(res).toEqual('iterations_required')
        done()
      }, done)
    })
  })

  describe('(de)encryptSecPass', () => {
    it('composition should be the identity', done =>
      wCrypto
        .encryptSecPass('sharedKey', 10, 'password', '300 years ago')
        .chain(wCrypto.decryptSecPass('sharedKey', 10, 'password'))
        .fork(done, res => {
          expect(res).toEqual('300 years ago')
          done()
        }))
  })

  describe('decryptWalletV1 (v1)', () => {
    it('should decrypt the wallet correctly', done => {
      wCrypto.decryptWalletV1('mypassword', data.v1).fork(done, wallet => {
        expect(wallet.guid).toEqual('5b0e3243-1e61-40d5-bd0e-3c1e5dfcda48')
        done()
      })
    })
  })

  describe('decryptWalletV2V3 (v2)', () => {
    it('should decrypt the wallet correctly', done => {
      wCrypto.decryptWalletV2V3('mypassword', data.v2).fork(done, wallet => {
        expect(wallet.guid).toEqual('40f09ca9-4a94-47ad-b9c8-47d4bbacef5e')
        done()
      })
    })
  })

  describe('decryptWalletV2V3 (v3)', () => {
    it('should decrypt the wallet correctly', done => {
      wCrypto.decryptWalletV2V3('mypassword', data.v3).fork(done, wallet => {
        expect(wallet.guid).toEqual('e01a59a0-31f2-4403-8488-32ffd8fdb3cc')
        done()
      })
    })
  })

  describe('decryptWallet (V4)', () => {
    it('should decrypt the wallet correctly', done => {
      wCrypto.decryptWallet('blockchain', data.v4).fork(done, wallet => {
        expect(wallet.guid).toEqual('d9e5766d-d646-4b3a-b32e-4bda649e4c45')
        done()
      })
    })
  })

  describe('hashNTimes 100 times', () => {
    it('should compute correct hash', () => {
      let hash = wCrypto.hashNTimes(
        100,
        "setze jutges d'un jutjat mengen fetge d'un penjat"
      )
      expect(hash.toString('hex')).toBe(
        'bb60847b9b18d2c73dbc6066b036554c430f3bedd64cd84c14b9643bf911a3fe'
      )
    })
    it('should compute correct hash part 2', () => {
      let hash = wCrypto.hashNTimes(2, '')
      expect(hash.toString('hex')).toBe(
        '5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456'
      )
    })
  })

  describe('correctly work with shared secret', () => {
    it('should correctly derive public from secret', () => {
      const priv = Buffer.from(
        '8ca745f6ff8c67a63dcb448b18c5cf111e44d16a6e587987d4212d0fba12c74f',
        'hex'
      )
      expect(wCrypto.derivePubFromPriv(priv).toString('hex')).toBe(
        '03a4ddec8d6b42cce5eef709e1e99858caa47755e335564c42aafc61fb87aa8830'
      )
    })
    it('should correctly calculate shared secret', () => {
      const priv = Buffer.from(
        '9cd3b16e10bd574fed3743d8e0de0b7b4e6c69f3245ab5a168ef010d22bfefa0',
        'hex'
      )
      const pub = Buffer.from(
        '02a18a98316b5f52596e75bfa5ca9fa9912edd0c989b86b73d41bb64c9c6adb992',
        'hex'
      )
      expect(wCrypto.deriveSharedSecret(priv, pub).toString('hex')).toBe(
        'c87e593a1b22bad696489aa7c240356ffc8ff453d4637dc9cd32b4696df93f5c'
      )
    })
    it('should correctly encrypt and decrypt', () => {
      const key = Buffer.from(
        '9cd3b16e10bd574fed3743d8e0de0b7b4e6c69f3245ab5a168ef010d22bfefa0',
        'hex'
      )
      const msg = 'This is a test sentence!'
      const cipher = wCrypto.encryptAESGCM(key, Buffer.from(msg, 'utf8'))
      const decrypted = wCrypto.decryptAESGCM(key, cipher).toString('utf8')
      expect(decrypted).toBe(msg)
    })
    it('should fail for modified message', () => {
      const key = Buffer.from(
        '9cd3b16e10bd574fed3743d8e0de0b7b4e6c69f3245ab5a168ef010d22bfefa0',
        'hex'
      )
      const msg = 'This is a test sentence!'
      const cipher = wCrypto.encryptAESGCM(key, Buffer.from(msg, 'utf8'))
      for (let position = 0; position < cipher.length; position++) {
        let c = Buffer.from(cipher)
        c[position]++
        expect(() => {
          wCrypto.decryptAESGCM(key, c)
        }).toThrow('Unsupported state or unable to authenticate data')
      }
    })
    it('should correctly decrypt from test vector', () => {
      const key = Buffer.from(
        '9cd3b16e10bd574fed3743d8e0de0b7b4e6c69f3245ab5a168ef010d22bfefa0',
        'hex'
      )
      const msg = 'This is a test sentence!'
      const decrypted = wCrypto
        .decryptAESGCM(
          key,
          Buffer.from(
            '83e77704adf28646b602047763a179b5991a5d5d4457658200c84936c71e5e7ffb54a1dcf665d836cb2ce34a471747eb64392e80',
            'hex'
          )
        )
        .toString('utf8')
      expect(decrypted).toBe(msg)
    })
  })
})
