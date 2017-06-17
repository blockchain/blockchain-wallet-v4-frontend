// import chai from 'chai'
// import * as R from 'ramda'
// import chaiImmutable from 'chai-immutable'
// import { HDWallet, serializer } from '../../src/types'
// const { expect } = chai
// chai.use(chaiImmutable)

// const walletFixture = require('../_fixtures/Wallet/wallet.v3')
// const walletNewFixture = require('../_fixtures/Wallet/wallet-new.v3')

// describe('HDWallet', () => {
//   const hdWalletFixture = walletFixture.hd_wallets[0]
//   const hdWallet = HDWallet.fromJS(hdWalletFixture)

//   describe('toJS', () => {
//     it('should return the correct object', () => {
//       expect(HDWallet.toJS(hdWallet)).to.deep.equal(hdWalletFixture)
//     })
//   })

//   describe('properties', () => {
//     it('should have a seedHex', () => {
//       expect(hdWallet.seedHex).to.equal(hdWalletFixture.seed_hex)
//     })
//   })

//   describe('createNew', () => {
//     const { wallet, mnemonic } = walletNewFixture
//     const hdWallet = HDWallet.createNew(mnemonic)

//     it('should generate the correct seed hex', () => {
//       expect(hdWallet.seedHex).to.equal(wallet.hd_wallets[0].seed_hex)
//     })

//     it('should have the correct first account', () => {
//       let firstAccount = HDWallet.toJS(hdWallet).accounts[0]
//       let accountFixtureNoLabels = R.set(R.lensProp('address_labels'), [], hdWalletFixture.accounts[0])
//       expect(firstAccount).to.deep.equal(accountFixtureNoLabels)
//     })

//     it('should optionally set the first account label', () => {
//       let label = 'another label'
//       let hdWalletLabelled = HDWallet.createNew(mnemonic, { label })
//       let firstAccount = HDWallet.toJS(hdWalletLabelled).accounts[0]
//       expect(firstAccount.label).to.equal(label)
//     })
//   })

//   describe('serializer: ', () => {
//     // it('compose(reviver, replacer) should be identity', () => {
//     //   const ser = JSON.stringify(hdWallet, serializer.replacer)
//     //   const unser = JSON.parse(ser, serializer.reviver)
//     //   expect(unser).to.deep.equal(hdWallet)
//     // })
//     it('compose(replacer, reviver) should be identity', () => {
//       const ser = JSON.stringify(hdWallet, serializer.replacer)
//       const unser = JSON.parse(ser, serializer.reviver)
//       const ser2 = JSON.stringify(unser, serializer.replacer)
//       expect(ser).to.equal(ser2)
//     })
//   })
// })
