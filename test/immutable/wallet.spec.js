import chai from 'chai'
import spies from 'chai-spies'
import * as R from 'ramda'

chai.use(spies)
const { expect } = chai

import * as WalletUtil from '../../src/immutable/Wallet'
import Address, * as AddressUtil from '../../src/immutable/Address'
import * as crypto from '../../src/WalletCrypto'

const walletFixture = require('../_fixtures/wallet.v3')
const walletFixtureSecpass = require('../_fixtures/wallet.v3-secpass')
const secpass = 'secret'

describe('Wallet', () => {
  const wallet = WalletUtil.fromJS(walletFixture)
  const walletSecpass = WalletUtil.fromJS(walletFixtureSecpass)

  crypto.encryptSecPass = R.curry((a, b, c, s) => `enc<${s}>`)

  describe('toJS', () => {
    it('should return the correct object', () => {
      let result = WalletUtil.toJS(wallet)
      expect(result).to.deep.equal(walletFixture)
    })
  })

  describe('selectors', () => {
    it('should throw if it does not receive a Wallet instance', () => {
      expect(() => WalletUtil.select(WalletUtil.guid, {})).to.throw(TypeError)
    })

    it('should select guid', () => {
      expect(WalletUtil.selectGuid(wallet)).to.equal(walletFixture.guid)
    })

    it('should select iterations', () => {
      expect(WalletUtil.selectIterations(wallet)).to.equal(walletFixture.options.pbkdf2_iterations)
    })

    it('should select addresses', () => {
      expect(WalletUtil.selectAddresses(wallet)).to.deep.equal(walletFixture.keys)
    })

    it('should select if is double encrypted', () => {
      let doubleEnc = WalletUtil.fromJS({ double_encryption: true })
      expect(WalletUtil.isDoubleEncrypted(wallet)).to.equal(false)
      expect(WalletUtil.isDoubleEncrypted(doubleEnc)).to.equal(true)
    })
  })

  describe('addAddress', () => {
    it('should add an unencrypted address', () => {
      let address = { priv: '5abc' }
      let withNewAddress = WalletUtil.addAddress(wallet, address, null)
      let addresses = WalletUtil.selectAddresses(withNewAddress)
      expect(addresses.length).to.equal(walletFixture.keys.length + 1)
      expect(R.last(addresses)).to.deep.equal(address)
    })

    it('should add a double encrypted address', () => {
      let address = new Address({ priv: '5abc' })
      let withNewAddress = WalletUtil.addAddress(walletSecpass, address, 'secret')
      let as = WalletUtil.selectAddresses(withNewAddress)
      expect(as.length).to.equal(walletFixture.keys.length + 1)
      expect(AddressUtil.selectPriv(R.last(as))).to.equal('enc<5abc>')
    })
  })

  describe('isValidSecondPwd', () => {
    it('should be valid for an unencrypted wallet', () => {
      let isValid = WalletUtil.isValidSecondPwd(null, wallet)
      expect(isValid).to.equal(true)
    })

    it('should detect a valid second password', () => {
      let isValid = WalletUtil.isValidSecondPwd(secpass, walletSecpass)
      expect(isValid).to.equal(true)
    })

    it('should detect an invalid second password', () => {
      let secpass = 'wrong_secpass'
      let isValid = WalletUtil.isValidSecondPwd(secpass, walletSecpass)
      expect(isValid).to.equal(false)
    })
  })

  describe.skip('encrypt', () => {
    it('should encrypt', () => {
      let encrypted = WalletUtil.encrypt('secret', wallet).value
      expect(WalletUtil.toJS(encrypted)).to.deep.equal(walletFixtureSecpass)
    })
  })
})
