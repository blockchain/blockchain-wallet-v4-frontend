import * as Bitcoin from 'bitcoinjs-lib'

import * as HDAccount from './HDAccount'
import * as HDAccount_DEPRECATED_V3 from './HDAccount_DEPRECATED_V3'
import * as HDAccountList from './HDAccountList'
import * as HDAccountList_DEPRECATED_V3 from './HDAccountList_DEPRECATED_V3'
import * as HDWallet from './HDWallet'
import * as HDWallet_DEPRECATED_V3 from './HDWallet_DEPRECATED_V3'
import * as HDWalletList from './HDWalletList'
import * as HDWalletList_DEPRECATED_V3 from './HDWalletList_DEPRECATED_V3'
import { serializer, Wrapper } from './index'
import * as Wallet from './Wallet'
import * as Wallet_DEPRECATED_V3 from './Wallet_DEPRECATED_V3'

const encryptedPayloadV3 = require('./__mocks__/encrypted-payload.v3.json')
const encryptedPayloadV4 = require('./__mocks__/encrypted-payload.v4.json')
const wrapperFixture = require('./__mocks__/wrapper.v4')
const wrapperFixtureV4Segwit = require('./__mocks__/wrapper.v4-segwit')
const wrapperFixtureV3 = require('./__mocks__/wrapper.v3')
const wrapperFixtureV2 = require('./__mocks__/wrapper.v2')

const taskToPromise = t =>
  new Promise((resolve, reject) => t.fork(reject, resolve))

describe('Wrapper', () => {
  const wrapper = Wrapper.fromJS(wrapperFixture)
  const wrapperV4Segwit = Wrapper.fromJS(wrapperFixtureV4Segwit)
  const wrapperV3 = Wrapper.fromJS(wrapperFixtureV3)
  const wrapperV2 = Wrapper.fromJS(wrapperFixtureV2)

  describe('serializer', () => {
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(wrapper)
      const newWrapper = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newWrapper)
      expect(string2).toEqual(string)
    })
  })

  describe('upgradeToV3', () => {
    it('should upgrade to a v3 wallet without derivations', async () => {
      const upgradeTask = Wrapper.upgradeToV3(
        'setup execute steel canal unable build farm purchase history erode gain vapor',
        null,
        Bitcoin.networks.bitcoin,
        wrapperV2
      )
      const upgraded = await taskToPromise(upgradeTask)
      const jsWrapper = Wrapper.toJS(upgraded)
      expect(jsWrapper.version).toBe(3)
      const hd = jsWrapper.wallet.hd_wallets[0]
      const account = hd.accounts[0]
      expect(account.derivations).toBe(undefined)
    })
  })

  describe('upgradeToV4', () => {
    it('should upgrade to a v4 wallet with segwit', async () => {
      const upgradeTask = Wrapper.upgradeToV4(
        '6a4d9524d413fdf69ca1b5664d1d6db0',
        null,
        Bitcoin.networks.bitcoin,
        wrapperV3
      )
      const upgraded = await taskToPromise(upgradeTask)
      const stringifiedUpgraded = JSON.stringify(upgraded.toJSON())
      const stringifiedSegwitWrapper = JSON.stringify(wrapperV4Segwit.toJSON())
      expect(stringifiedUpgraded).toEqual(stringifiedSegwitWrapper)
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('fromJS', () => {
    /* eslint-disable */
    // V3
    const deprecatedWalletSpy = jest.spyOn(Wallet_DEPRECATED_V3, 'fromJS')
    const HDAccountDeprecatedSpy = jest.spyOn(HDAccount_DEPRECATED_V3, 'fromJS')
    const HDAccountListDeprecatedSpy = jest.spyOn(
      HDAccountList_DEPRECATED_V3,
      'fromJS'
    )
    const HDWalletDeprecatedSpy = jest.spyOn(HDWallet_DEPRECATED_V3, 'fromJS')
    const HDWalletListDeprecatedSpy = jest.spyOn(
      HDWalletList_DEPRECATED_V3,
      'fromJS'
    )
    // V4
    const walletSpy = jest.spyOn(Wallet, 'fromJS')
    const HDAccountSpy = jest.spyOn(HDAccount, 'fromJS')
    const HDAccountListSpy = jest.spyOn(HDAccountList, 'fromJS')
    const HDWalletSpy = jest.spyOn(HDWallet, 'fromJS')
    const HDWalletListSpy = jest.spyOn(HDWalletList, 'fromJS')
    /* eslint-enable */

    describe('v3', () => {
      it('follows v3 path', () => {
        Wrapper.fromJS(wrapperFixtureV3)
        // V3
        expect(deprecatedWalletSpy).toHaveBeenCalled()
        expect(HDAccountDeprecatedSpy).toHaveBeenCalled()
        expect(HDAccountListDeprecatedSpy).toHaveBeenCalled()
        expect(HDWalletDeprecatedSpy).toHaveBeenCalled()
        expect(HDWalletListDeprecatedSpy).toHaveBeenCalled()
        // V4
        expect(walletSpy).not.toHaveBeenCalled()
        expect(HDAccountSpy).not.toHaveBeenCalled()
        expect(HDAccountListSpy).not.toHaveBeenCalled()
        expect(HDWalletSpy).not.toHaveBeenCalled()
        expect(HDWalletListSpy).not.toHaveBeenCalled()
      })
    })
    describe('v4', () => {
      it('follows v4 path', () => {
        Wrapper.fromJS(wrapperFixtureV4Segwit)
        // V3
        expect(deprecatedWalletSpy).not.toHaveBeenCalled()
        expect(HDAccountDeprecatedSpy).not.toHaveBeenCalled()
        expect(HDAccountListDeprecatedSpy).not.toHaveBeenCalled()
        expect(HDWalletDeprecatedSpy).not.toHaveBeenCalled()
        expect(HDWalletListDeprecatedSpy).not.toHaveBeenCalled()
        // V4
        expect(walletSpy).toHaveBeenCalled()
        expect(HDAccountSpy).toHaveBeenCalled()
        expect(HDAccountListSpy).toHaveBeenCalled()
        expect(HDWalletSpy).toHaveBeenCalled()
        expect(HDWalletListSpy).toHaveBeenCalled()
      })
    })
  })

  describe('fromEncPayload', () => {
    /* eslint-disable */
    // V3
    const deprecatedWalletSpy = jest.spyOn(
      Wallet_DEPRECATED_V3,
      'fromEncryptedPayload'
    )
    // V4
    const walletSpy = jest.spyOn(Wallet, 'fromEncryptedPayload')
    /* eslint-enable */

    describe('v3', () => {
      it('follows v3 path', () => {
        Wrapper.fromEncPayload('blockchain', encryptedPayloadV3)
        // V3
        expect(deprecatedWalletSpy).toHaveBeenCalled()
        // V4
        expect(walletSpy).not.toHaveBeenCalled()
      })
    })
    describe('v4', () => {
      it('follows v4 path', () => {
        Wrapper.fromEncPayload('blockchain', encryptedPayloadV4)
        // V3
        expect(deprecatedWalletSpy).not.toHaveBeenCalled()
        // V4
        expect(walletSpy).toHaveBeenCalled()
      })
    })
  })

  describe('toEncJSON', () => {
    /* eslint-disable */
    // V3
    const deprecatedSpy = jest.spyOn(Wallet_DEPRECATED_V3, 'toEncryptedPayload')
    // V4
    const toEncryptedPayloadSpy = jest.spyOn(Wallet, 'toEncryptedPayload')
    /* eslint-enable */

    describe('v3', () => {
      it('follows v3 path', () => {
        Wrapper.toEncJSON(wrapperV3)
        // V3
        expect(deprecatedSpy).toHaveBeenCalled()
        // V4
        expect(toEncryptedPayloadSpy).not.toHaveBeenCalled()
      })
    })
    describe('v4', () => {
      it('follows v4 path', () => {
        Wrapper.toEncJSON(wrapperV4Segwit)
        // V3
        expect(deprecatedSpy).not.toHaveBeenCalled()
        // V4
        expect(toEncryptedPayloadSpy).toHaveBeenCalled()
      })
    })
  })
})
