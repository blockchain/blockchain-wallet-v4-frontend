import * as R from 'ramda'
import { Address, Wallet, AddressMap, serializer } from './index'
import * as crypto from '../walletCrypto/index'

const walletFixture = require('./__mocks__/wallet.v3')
const walletFixtureSecpass = require('./__mocks__/wallet.v3-secpass')
const secpass = 'secret'

describe('Wallet', () => {
  const wallet = Wallet.fromJS(walletFixture)
  const walletSecpass = Wallet.fromJS(walletFixtureSecpass)

  crypto.encryptDataWithKey = (data, key, iv) => data ? `enc<${data}>` : null

  describe('toJS', () => {
    it('should return the correct object', () => {
      let result = Wallet.toJS(wallet)
      expect(result).toEqual(walletFixture)
    })
  })

  describe('selectors', () => {
    it('should throw if it does not receive a Wallet instance', () => {
      expect(() => Wallet.select(Wallet.guid, {})).toThrow(TypeError)
    })

    it('should select guid', () => {
      expect(wallet.guid).toEqual(walletFixture.guid)
      expect(Wallet.selectGuid(wallet)).toEqual(walletFixture.guid)
    })

    it('should select iterations', () => {
      expect(Wallet.selectIterations(wallet)).toEqual(walletFixture.options.pbkdf2_iterations)
    })

    it('should select addresses', () => {
      let addressesJS = R.compose(AddressMap.toJS, Wallet.selectAddresses)(wallet)
      expect(addressesJS).toEqual(walletFixture.keys)
    })

    it('should select if is double encrypted', () => {
      expect(Wallet.isDoubleEncrypted(wallet)).toEqual(false)
      expect(Wallet.isDoubleEncrypted(walletSecpass)).toEqual(true)
    })
  })

  describe('addAddress', () => {
    it('should add an unencrypted address', () => {
      let n = walletFixture.keys.length
      let address = Address.fromJS({ addr: 'address', priv: '5abc' })
      let withNewAddress = Wallet.addAddress(wallet, address, null)
      expect(withNewAddress.isRight).toEqual(true)
      let addresses = Wallet.selectAddresses(withNewAddress.value)
      expect(addresses.size).toEqual(n + 1)
      const newAddr = R.compose(AddressMap.selectAddress('address'), Wallet.selectAddresses)(withNewAddress.value)
      expect(newAddr).toEqual(address)
    })

    it('should add a double encrypted address', () => {
      let n = walletFixture.keys.length
      let address = Address.fromJS({ priv: '5abc', addr: '1asdf' })
      let withNewAddress = Wallet.addAddress(walletSecpass, address, 'secret')
      expect(withNewAddress.isRight).toEqual(true)
      let as = Wallet.selectAddresses(withNewAddress.value)
      expect(as.size).toEqual(n + 1)
      const encPriv = R.compose(Address.selectPriv, AddressMap.selectAddress('1asdf'), Wallet.selectAddresses)(withNewAddress.value)
      expect(encPriv).toEqual('enc<5abc>')
    })
  })

  describe('setAddressLabel', () => {
    it('should set a new address label', () => {
      let addr = '14mQxLtEagsS8gYsdWJbzthFFuPDqDgtxQ'
      let withNewLabel = Wallet.setLegacyAddressLabel(addr, 'new_label', wallet)
      expect(wallet.addresses.get(addr).label).toEqual('labeled_imported')
      expect(withNewLabel.addresses.get(addr).label).toEqual('new_label')
    })
  })

  describe('isValidSecondPwd', () => {
    it('should be valid for an unencrypted wallet', () => {
      let isValid = Wallet.isValidSecondPwd(null, wallet)
      expect(isValid).toEqual(true)
    })

    it('should detect a valid second password', () => {
      let isValid = Wallet.isValidSecondPwd(secpass, walletSecpass)
      expect(isValid).toEqual(true)
    })

    it('should detect an invalid second password', () => {
      let secpass = 'wrong_secpass'
      let isValid = Wallet.isValidSecondPwd(secpass, walletSecpass)
      expect(isValid).toEqual(false)
    })
  })

  describe('encrypt', () => {
    it('should encrypt', (done) => {
      Wallet.encrypt('secret', wallet).fork(done, (encrypted) => {
        let [before, after] = [wallet, encrypted].map(Wallet.selectAddresses)
        let enc = crypto.encryptDataWithKey
        let success = R.zip(before, after).every(([b, a]) => enc(b.priv) === a.priv)
        expect(success).toEqual(true)
        done()
      })
    })
  })

  describe('encryptSync', () => {
    it('should encrypt', () => {
      let encrypted = Wallet.encryptSync('secret', wallet).value
      let [before, after] = [wallet, encrypted].map(Wallet.selectAddresses)
      let enc = crypto.encryptDataWithKey
      let success = R.zip(before, after).every(([b, a]) => enc(b.priv) === a.priv)
      expect(success).toEqual(true)
    })
  })

  describe('decrypt', () => {
    it('should decrypt', (done) => {
      Wallet.decrypt('secret', walletSecpass).fork(done, (decrypted) => {
        expect(Wallet.toJS(decrypted)).toEqual(walletFixture)
        done()
      })
    })

    it('should fail when given an incorrect password', (done) => {
      Wallet.decrypt('wrong', walletSecpass).fork((error) => {
        expect(R.is(Error, error)).toEqual(true)
        expect(error.message).toEqual('INVALID_SECOND_PASSWORD')
        done()
      }, done)
    })
  })

  describe('decryptSync', () => {
    it('should decrypt', () => {
      let decrypted = Wallet.decryptSync('secret', walletSecpass).value
      expect(Wallet.toJS(decrypted)).toEqual(walletFixture)
    })

    it('should fail when given an incorrect password', () => {
      let decrypted = Wallet.decryptSync('wrong', walletSecpass).value
      expect(R.is(Error, decrypted)).toEqual(true)
      expect(decrypted.message).toEqual('INVALID_SECOND_PASSWORD')
    })
  })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(wallet)
      const newWallet = JSON.parse(string, serializer.reviver)
      expect(newWallet).toEqual(wallet)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(wallet)
      const newWallet = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newWallet)
      expect(string2).toEqual(string)
    })
  })

  // describe('createNew', () => {
  //   const { mnemonic } = walletNewFixture

  //   it('should create a new wallet', () => {
  //     let { guid, sharedKey } = walletNewFixture.wallet
  //     let wallet = Wallet.createNew(guid, sharedKey, mnemonic)
  //     expect(Wallet.toJS(wallet)).toEqual(walletNewFixture.wallet)
  //   })
  // })
})
