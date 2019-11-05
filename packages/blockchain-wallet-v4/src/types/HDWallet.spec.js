import { HDWallet, serializer } from './index'

const walletFixture = require('./__mocks__/wallet.v4')

describe('HDWallet', () => {
  const hdWalletFixture = walletFixture.hd_wallets[0]
  const hdWallet = HDWallet.fromJS(hdWalletFixture)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(HDWallet.toJS(hdWallet)).toEqual(hdWalletFixture)
    })
  })

  describe('properties', () => {
    it('should have a seedHex', () => {
      expect(hdWallet.seedHex).toEqual(hdWalletFixture.seed_hex)
    })
  })

  // describe('createNew', () => {
  //   const { wallet, mnemonic } = walletNewFixture
  //   const hdWallet = HDWallet.createNew(mnemonic)

  //   it('should generate the correct seed hex', () => {
  //     expect(hdWallet.seedHex).toEqual(wallet.hd_wallets[0].seed_hex)
  //   })

  //   it('should have the correct first account', () => {
  //     let firstAccount = HDWallet.toJS(hdWallet).accounts[0]
  //     let accountFixtureNoLabels = R.set(R.lensProp('address_labels'), [], hdWalletFixture.accounts[0])
  //     expect(firstAccount).toEqual(accountFixtureNoLabels)
  //   })

  //   it('should optionally set the first account label', () => {
  //     let label = 'another label'
  //     let hdWalletLabelled = HDWallet.createNew(mnemonic, { label })
  //     let firstAccount = HDWallet.toJS(hdWalletLabelled).accounts[0]
  //     expect(firstAccount.label).toEqual(label)
  //   })
  // })

  describe('serializer', () => {
    it('compose(reviver, replacer) should be identity', () => {
      const string = JSON.stringify(hdWallet)
      const newHDWallet = JSON.parse(string, serializer.reviver)
      expect(newHDWallet).toEqual(hdWallet)
    })
    it('compose(replacer, reviver) should be identity', () => {
      const string = JSON.stringify(hdWallet)
      const newHDWallet = JSON.parse(string, serializer.reviver)
      const string2 = JSON.stringify(newHDWallet)
      expect(string2).toEqual(string)
    })
  })
})
