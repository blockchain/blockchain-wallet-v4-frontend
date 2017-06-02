import chai from 'chai'
import spies from 'chai-spies'
import * as R from 'ramda'
import * as WalletUtil from '../../src/data/Wallet'
import Address, * as AddressUtil from '../../src/data/Address'
import * as crypto from '../../src/WalletCrypto'

chai.use(spies)
const { expect } = chai

const walletFixture = require('../_fixtures/wallet.v3')
const walletNewFixture = require('../_fixtures/wallet-new.v3')
const walletFixtureSecpass = require('../_fixtures/wallet.v3-secpass')
const secpass = 'secret'

describe('Wallet', () => {
  const wallet = WalletUtil.fromJS(walletFixture)
  const walletSecpass = WalletUtil.fromJS(walletFixtureSecpass)

  crypto.encryptDataWithKey = (data, key, iv) => data ? `enc<${data}>` : null

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
      let selectAddressesJS = R.compose(R.map(AddressUtil.toJS), WalletUtil.selectAddresses)
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
      expect(withNewAddress.isRight).to.equal(true)
      let addresses = WalletUtil.selectAddresses(withNewAddress.value)
      expect(addresses.length).to.equal(walletFixture.keys.length + 1)
      expect(AddressUtil.toJS(R.last(addresses))).to.deep.equal(AddressUtil.toJS(address))
    })

    it('should add a double encrypted address', () => {
      let address = new Address({ priv: '5abc', addr: '1asdf' })
      let withNewAddress = WalletUtil.addAddress(walletSecpass, address, 'secret')
      expect(withNewAddress.isRight).to.equal(true)
      let as = WalletUtil.selectAddresses(withNewAddress.value)
      expect(as.length).to.equal(walletFixture.keys.length + 1)
      expect(R.last(as).priv).to.equal('enc<5abc>')
    })
  })

  describe('setAddressLabel', () => {
    it('should set a new address label', () => {
      let addr = '14mQxLtEagsS8gYsdWJbzthFFuPDqDgtxQ'
      let withNewLabel = WalletUtil.setAddressLabel(addr, 'new_label', wallet)
      expect(wallet.addresses.get(addr).label).to.equal('labeled_imported')
      expect(withNewLabel.addresses.get(addr).label).to.equal('new_label')
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
    it('should encrypt', (done) => {
      WalletUtil.encrypt('secret', wallet).fork(done, (encrypted) => {
        let [before, after] = [wallet, encrypted].map(WalletUtil.selectAddresses)
        let enc = crypto.encryptDataWithKey
        let success = R.zip(before, after).every(([b, a]) => enc(b.priv) === a.priv)
        expect(success).to.equal(true)
        done()
      })
    })
  })

  describe('encryptSync', () => {
    it('should encrypt', () => {
      let encrypted = WalletUtil.encryptSync('secret', wallet).value
      let [before, after] = [wallet, encrypted].map(WalletUtil.selectAddresses)
      let enc = crypto.encryptDataWithKey
      let success = R.zip(before, after).every(([b, a]) => enc(b.priv) === a.priv)
      expect(success).to.equal(true)
    })
  })

  describe('decrypt', () => {
    it('should decrypt', (done) => {
      WalletUtil.decrypt('secret', walletSecpass).fork(done, (decrypted) => {
        expect(WalletUtil.toJS(decrypted)).to.deep.equal(walletFixture)
        done()
      })
    })

    it('should fail when given an incorrect password', (done) => {
      WalletUtil.decrypt('wrong', walletSecpass).fork((error) => {
        expect(R.is(Error, error)).to.equal(true)
        expect(error.message).to.equal('INVALID_SECOND_PASSWORD')
        done()
      }, done)
    })
  })

  describe('decryptSync', () => {
    it('should decrypt', () => {
      let decrypted = WalletUtil.decryptSync('secret', walletSecpass).value
      expect(WalletUtil.toJS(decrypted)).to.deep.equal(walletFixture)
    })

    it('should fail when given an incorrect password', () => {
      let decrypted = WalletUtil.decryptSync('wrong', walletSecpass).value
      expect(R.is(Error, decrypted)).to.equal(true)
      expect(decrypted.message).to.equal('INVALID_SECOND_PASSWORD')
    })
  })

  describe('createNew', () => {
    const { mnemonic } = walletNewFixture

    it('should create a new wallet', () => {
      let { guid, sharedKey } = walletNewFixture.wallet
      let wallet = WalletUtil.createNew(guid, sharedKey, mnemonic)
      expect(WalletUtil.toJS(wallet)).to.deep.equal(walletNewFixture.wallet)
    })
  })
})
