import * as R from 'ramda'
import { Address, Wallet, AddressMap, serializer } from './index'
import * as crypto from '../walletCrypto/index'

const walletFixture = require('./__mocks__/wallet.v3')
const walletFixtureSecpass = require('./__mocks__/wallet.v3-secpass')
const secpass = 'secret'

describe('Wallet', () => {
  const wallet = Wallet.fromJS(walletFixture)
  const walletSecpass = Wallet.fromJS(walletFixtureSecpass)

  crypto.encryptDataWithKey = (data, key, iv) => (data ? `enc<${data}>` : null)

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
      expect(Wallet.selectIterations(wallet)).toEqual(
        walletFixture.options.pbkdf2_iterations
      )
    })

    it('should select addresses', () => {
      let addressesJS = R.compose(
        AddressMap.toJS,
        Wallet.selectAddresses
      )(wallet)
      expect(addressesJS).toEqual(walletFixture.keys)
    })

    it('should select if is double encrypted', () => {
      expect(Wallet.isDoubleEncrypted(wallet)).toEqual(false)
      expect(Wallet.isDoubleEncrypted(walletSecpass)).toEqual(true)
    })
  })

  describe('importLegacyAddress', () => {
    const n = walletFixture.keys.length
    const address = Address.fromJS({
      addr: '1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj',
      priv: '5Kb8kLf9zgWQnogidDA76MzPL6TsZZY36hWXMssSzNydYXYB9KF'
    })

    it('should add an unencrypted address', () => {
      Wallet.importLegacyAddress(
        wallet,
        address.priv,
        0,
        undefined,
        undefined,
        {}
      ).fork(
        failure => expect(failure).toEqual(undefined),
        withNewAddress => {
          let addresses = Wallet.selectAddresses(withNewAddress)
          expect(addresses.size).toEqual(n + 1)
          const newAddr = R.compose(
            AddressMap.selectAddress('1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj'),
            Wallet.selectAddresses
          )(withNewAddress)
          expect(newAddr.addr).toEqual(address.addr)
          expect(newAddr.priv).toEqual(
            'GibbqZhygNfhbfz4fb2vDg19Ym5v696w52iqZEQySHTw'
          )
        }
      )
    })

    it('should add a double encrypted address', () => {
      Wallet.importLegacyAddress(
        wallet,
        address.priv,
        0,
        'secret',
        undefined,
        {}
      ).fork(
        failure => expect(failure).toEqual(undefined),
        withNewAddress => {
          let addresses = Wallet.selectAddresses(withNewAddress)
          expect(addresses.size).toEqual(n + 1)
          const newAddr = R.compose(
            AddressMap.selectAddress('1CC3X2gu58d6wXUWMffpuzN9JAfTUWu4Kj'),
            Wallet.selectAddresses
          )(withNewAddress)
          expect(newAddr.addr).toEqual(address.addr)
          expect(newAddr.priv).toEqual(
            'GibbqZhygNfhbfz4fb2vDg19Ym5v696w52iqZEQySHTw'
          ) // << TODO this is not encrypted?
        }
      )
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
    it('should encrypt', done => {
      Wallet.encrypt('secret', wallet).fork(done, encrypted => {
        let [before, after] = [wallet, encrypted].map(Wallet.selectAddresses)
        let enc = crypto.encryptDataWithKey
        let success = R.zip(before, after).every(
          ([b, a]) => enc(b.priv) === a.priv
        )
        expect(success).toEqual(true)
        done()
      })
    })
  })

  describe('decrypt', () => {
    it('should decrypt', done => {
      Wallet.decrypt('secret', walletSecpass).fork(done, decrypted => {
        expect(Wallet.toJS(decrypted)).toEqual(walletFixture)
        done()
      })
    })

    it('should fail when given an incorrect password', done => {
      Wallet.decrypt('wrong', walletSecpass).fork(error => {
        expect(R.is(Error, error)).toEqual(true)
        expect(error.message).toEqual('INVALID_SECOND_PASSWORD')
        done()
      }, done)
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
