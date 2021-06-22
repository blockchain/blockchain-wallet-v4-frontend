import * as Bitcoin from 'bitcoinjs-lib'

import { HDAccount, serializer } from './index'

const accFixture = require('./__mocks__/hdaccount.v4')
const accFixture2 = require('./__mocks__/hdaccount.v4.bch_cache_bug_06_2021.json')

const network = Bitcoin.networks.bitcoin

describe('HDAccount', () => {
  const account = HDAccount.fromJS(accFixture, 1)

  describe('toJS', () => {
    it('should return the correct object', () => {
      // @ts-ignore
      expect(HDAccount.toJS(account)).toEqual(accFixture)
    })
  })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(account)
      const newAccount = JSON.parse(string, serializer.reviver)
      expect(newAccount).toEqual(account)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(account)
      const newAccount = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newAccount)
      expect(string2).toEqual(string)
    })
  })

  describe('getAddress', () => {
    const newAccount: typeof HDAccount = HDAccount.fromJS(accFixture2, 0)
    describe('legacy', () => {
      it('should get the correct address', () => {
        const address = HDAccount.getAddress(newAccount, `M/${0}/${0}`, network, 'legacy')
        expect(address).toBe('1M2UruLHcubCXGwpk2QZvDTFECsCbCjJ7P')
      })
    })

    describe('bech32', () => {
      it('should get the correct address', () => {
        const address = HDAccount.getAddress(newAccount, `M/${0}/${0}`, network, 'bech32')
        expect(address).toBe('bc1q3y5ludft0n8d5amd8e0y9ajz6ljjjkv48mg9v6')
      })
    })
  })

  describe('getReceiveAddress', () => {
    const newAccount: typeof HDAccount = HDAccount.fromJS(accFixture2, 0)
    describe('legacy', () => {
      it('should get the correct receive address', () => {
        const address = HDAccount.getReceiveAddress(newAccount, 10, network, 'legacy')
        expect(address).toBe('1QFKaxdUSNH2kHSmTAnJAc296jap3E1jwy')
      })
    })

    describe('bech32', () => {
      it('should get the correct receive address', () => {
        const address = HDAccount.getReceiveAddress(newAccount, 10, network, 'bech32')
        expect(address).toBe('bc1q7sfpjj9s0u7mcf2u0ljdx49ajlqtle7f0vzkht')
      })
    })
  })

  describe('getChangeAddress', () => {
    const newAccount: typeof HDAccount = HDAccount.fromJS(accFixture2, 0)
    describe('legacy', () => {
      it('should get the correct change address', () => {
        const address = HDAccount.getChangeAddress(newAccount, 0, network, 'legacy')
        expect(address).toBe('1Ah7qZZmJktgvkdyipw5vYbGq4xbLwsnMg')
      })
    })

    describe('bech32', () => {
      it('should get the correct change address', () => {
        const address = HDAccount.getChangeAddress(newAccount, 0, network, 'bech32')
        expect(address).toBe('bc1qra3ukdwxxq5k7jw7zyrxuqez0af0g7fz4y3d28')
      })
    })
  })

  describe('getAddress', () => {
    const newAccount: typeof HDAccount = HDAccount.fromJS(accFixture2, 0)

    describe('bech32', () => {
      it('should get the correct receive address, when no type is passed', () => {
        const address = HDAccount.getAddress(newAccount, `M/0/0`, network)
        expect(address).toBe('bc1q3y5ludft0n8d5amd8e0y9ajz6ljjjkv48mg9v6')
      })
    })
  })

  describe('getReceiveAddress', () => {
    const newAccount: typeof HDAccount = HDAccount.fromJS(accFixture2, 0)

    describe('bech32', () => {
      it('should get the correct receive address, when no type is passed', () => {
        const address = HDAccount.getReceiveAddress(newAccount, 10, network)
        expect(address).toBe('bc1q7sfpjj9s0u7mcf2u0ljdx49ajlqtle7f0vzkht')
      })
    })
  })

  describe('getChangeAddress', () => {
    const newAccount: typeof HDAccount = HDAccount.fromJS(accFixture2, 0)
    describe('bech32', () => {
      it('should get the correct change address, when no type is passed', () => {
        const address = HDAccount.getChangeAddress(newAccount, 0, network)
        expect(address).toBe('bc1qra3ukdwxxq5k7jw7zyrxuqez0af0g7fz4y3d28')
      })
    })
  })
})
