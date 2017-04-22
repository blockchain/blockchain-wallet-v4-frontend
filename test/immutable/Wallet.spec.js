import chai from 'chai'
import spies from 'chai-spies'
import * as R from 'ramda'

chai.use(spies)
const { expect } = chai

import * as WalletUtil from '../../src/immutable/Wallet'
import Address, * as AddressUtil from '../../src/immutable/Address'
import * as crypto from '../../src/WalletCrypto'
import * as util from '../../src/util'

const walletFixture = require('../_fixtures/wallet.v3')
const walletFixtureSecpass = require('../_fixtures/wallet.v3-secpass')
const secpass = 'secret'

describe('Wallet', () => {
  const wallet = WalletUtil.fromJS(walletFixture)
  const walletSecpass = WalletUtil.fromJS(walletFixtureSecpass)

  crypto.encryptSecPass = R.curry((sk, iter, pw, str) => `enc<${str}>`)

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
      expect(wallet.guid).to.equal(walletFixture.guid)
      expect(WalletUtil.selectGuid(wallet)).to.equal(walletFixture.guid)
    })

    it('should select iterations', () => {
      expect(WalletUtil.selectIterations(wallet)).to.equal(walletFixture.options.pbkdf2_iterations)
    })

    it('should select addresses', () => {
      let selectAddressesJS = R.compose(util.iToJS, R.map(AddressUtil.toJS), WalletUtil.selectAddresses)
      expect(selectAddressesJS(wallet)).to.deep.equal(walletFixture.keys)
    })

    it('should select if is double encrypted', () => {
      expect(WalletUtil.isDoubleEncrypted(wallet)).to.equal(false)
      expect(WalletUtil.isDoubleEncrypted(walletSecpass)).to.equal(true)
    })
  })

  describe('addAddress', () => {
    it('should add an unencrypted address', () => {
      let address = new Address({ priv: '5abc' })
      let withNewAddress = WalletUtil.addAddress(wallet, address, null)
      let addresses = WalletUtil.selectAddresses(withNewAddress)
      expect(addresses.size).to.equal(walletFixture.keys.length + 1)
      expect(AddressUtil.toJS(addresses.last())).to.deep.equal(AddressUtil.toJS(address))
    })

    it('should add a double encrypted address', () => {
      let address = new Address({ priv: '5abc', addr: '1asdf' })
      let withNewAddress = WalletUtil.addAddress(walletSecpass, address, 'secret')
      let as = WalletUtil.selectAddresses(withNewAddress)
      expect(as.size).to.equal(walletFixture.keys.length + 1)
      expect(as.last().priv).to.equal('enc<5abc>')
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

  describe('encrypt', () => {
    it('should encrypt', () => {
      let encrypted = WalletUtil.encrypt('secret', wallet).value
      let [before, after] = [wallet, encrypted].map(R.compose(util.iToJS, WalletUtil.selectAddresses))
      let enc = crypto.encryptSecPass(null, null, null)
      let success = R.zip(before, after).every(([b, a]) => enc(b.priv) === a.priv)
      expect(success).to.equal(true)
    })
  })

  describe('decrypt', () => {
    it('should decrypt', () => {
      let decrypted = WalletUtil.decrypt('secret', walletSecpass).value
      expect(WalletUtil.toJS(decrypted)).to.deep.equal(walletFixture)
    })

    it('should fail when given an incorrect password', () => {
      let decrypted = WalletUtil.decrypt('wrong', walletSecpass).value
      expect(R.is(Error, decrypted)).to.equal(true)
      expect(decrypted.message).to.equal('INVALID_SECOND_PASSWORD')
    })
  })
})
