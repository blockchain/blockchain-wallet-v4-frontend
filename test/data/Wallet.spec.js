// import chai from 'chai'
// import spies from 'chai-spies'
// import * as R from 'ramda'
// import { Address, Wallet, HDWallet, HDAccount } from '../../src/types'
// import * as crypto from '../../src/WalletCrypto'

// chai.use(spies)
// const { expect } = chai

// const walletFixture = require('../_fixtures/Wallet/wallet.v3')
// const walletNewFixture = require('../_fixtures/Wallet/wallet-new.v3')
// const walletFixtureSecpass = require('../_fixtures/Wallet/wallet.v3-secpass')
// const secpass = 'secret'

// describe('Wallet', () => {
//   const wallet = Wallet.fromJS(walletFixture)
//   const walletSecpass = Wallet.fromJS(walletFixtureSecpass)

//   crypto.encryptDataWithKey = (data, key, iv) => data ? `enc<${data}>` : null

//   describe('toJS', () => {
//     it('should return the correct object', () => {
//       let result = Wallet.toJS(wallet)
//       expect(result).to.deep.equal(walletFixture)
//     })
//   })

//   describe('selectors', () => {
//     it('should throw if it does not receive a Wallet instance', () => {
//       expect(() => Wallet.select(Wallet.guid, {})).to.throw(TypeError)
//     })

//     it('should select guid', () => {
//       expect(wallet.guid).to.equal(walletFixture.guid)
//       expect(Wallet.selectGuid(wallet)).to.equal(walletFixture.guid)
//     })

//     it('should select iterations', () => {
//       expect(Wallet.selectIterations(wallet)).to.equal(walletFixture.options.pbkdf2_iterations)
//     })

//     it('should select addresses', () => {
//       let selectAddressesJS = R.compose(xs => xs.toJS(), R.map(Address.toJS), Wallet.selectAddresses)
//       expect(selectAddressesJS(wallet)).to.deep.equal(walletFixture.keys)
//     })

//     it('should select if is double encrypted', () => {
//       expect(Wallet.isDoubleEncrypted(wallet)).to.equal(false)
//       expect(Wallet.isDoubleEncrypted(walletSecpass)).to.equal(true)
//     })
//   })

//   describe('addAddress', () => {
//     it('should add an unencrypted address', () => {
//       let n = walletFixture.keys.length
//       let address = Address.fromJS({ priv: '5abc' })
//       let withNewAddress = Wallet.addAddress(wallet, address, null)
//       expect(withNewAddress.isRight).to.equal(true)
//       let addresses = Wallet.selectAddresses(withNewAddress.value)
//       expect(addresses.size).to.equal(n + 1)
//       expect(Address.toJS(addresses.get(n))).to.deep.equal(Address.toJS(address))
//     })

//     it('should add a double encrypted address', () => {
//       let n = walletFixture.keys.length
//       let address = Address.fromJS({ priv: '5abc', addr: '1asdf' })
//       let withNewAddress = Wallet.addAddress(walletSecpass, address, 'secret')
//       expect(withNewAddress.isRight).to.equal(true)
//       let as = Wallet.selectAddresses(withNewAddress.value)
//       expect(as.size).to.equal(n + 1)
//       expect(as.get(n).priv).to.equal('enc<5abc>')
//     })
//   })

//   describe('setAddressLabel', () => {
//     it('should set a new address label', () => {
//       let addr = '14mQxLtEagsS8gYsdWJbzthFFuPDqDgtxQ'
//       let withNewLabel = Wallet.setAddressLabel(addr, 'new_label', wallet)
//       expect(wallet.addresses.get(addr).label).to.equal('labeled_imported')
//       expect(withNewLabel.addresses.get(addr).label).to.equal('new_label')
//     })
//   })

//   describe('isValidSecondPwd', () => {
//     it('should be valid for an unencrypted wallet', () => {
//       let isValid = Wallet.isValidSecondPwd(null, wallet)
//       expect(isValid).to.equal(true)
//     })

//     it('should detect a valid second password', () => {
//       let isValid = Wallet.isValidSecondPwd(secpass, walletSecpass)
//       expect(isValid).to.equal(true)
//     })

//     it('should detect an invalid second password', () => {
//       let secpass = 'wrong_secpass'
//       let isValid = Wallet.isValidSecondPwd(secpass, walletSecpass)
//       expect(isValid).to.equal(false)
//     })
//   })

//   describe('encrypt', () => {
//     it('should encrypt', (done) => {
//       Wallet.encrypt('secret', wallet).fork(done, (encrypted) => {
//         let [before, after] = [wallet, encrypted].map(Wallet.selectAddresses)
//         let enc = crypto.encryptDataWithKey
//         let success = R.zip(before, after).every(([b, a]) => enc(b.priv) === a.priv)
//         expect(success).to.equal(true)
//         done()
//       })
//     })
//   })

//   describe('encryptSync', () => {
//     it('should encrypt', () => {
//       let encrypted = Wallet.encryptSync('secret', wallet).value
//       let [before, after] = [wallet, encrypted].map(Wallet.selectAddresses)
//       let enc = crypto.encryptDataWithKey
//       let success = R.zip(before, after).every(([b, a]) => enc(b.priv) === a.priv)
//       expect(success).to.equal(true)
//     })
//   })

//   describe('decrypt', () => {
//     it('should decrypt', (done) => {
//       Wallet.decrypt('secret', walletSecpass).fork(done, (decrypted) => {
//         expect(Wallet.toJS(decrypted)).to.deep.equal(walletFixture)
//         done()
//       })
//     })

//     it('should fail when given an incorrect password', (done) => {
//       Wallet.decrypt('wrong', walletSecpass).fork((error) => {
//         expect(R.is(Error, error)).to.equal(true)
//         expect(error.message).to.equal('INVALID_SECOND_PASSWORD')
//         done()
//       }, done)
//     })
//   })

//   describe('decryptSync', () => {
//     it('should decrypt', () => {
//       let decrypted = Wallet.decryptSync('secret', walletSecpass).value
//       expect(Wallet.toJS(decrypted)).to.deep.equal(walletFixture)
//     })

//     it('should fail when given an incorrect password', () => {
//       let decrypted = Wallet.decryptSync('wrong', walletSecpass).value
//       expect(R.is(Error, decrypted)).to.equal(true)
//       expect(decrypted.message).to.equal('INVALID_SECOND_PASSWORD')
//     })
//   })

//   describe('createNew', () => {
//     const { mnemonic } = walletNewFixture

//     it('should create a new wallet', () => {
//       let { guid, sharedKey } = walletNewFixture.wallet
//       let wallet = Wallet.createNew(guid, sharedKey, mnemonic)
//       expect(Wallet.toJS(wallet)).to.deep.equal(walletNewFixture.wallet)
//     })
//   })
// })
