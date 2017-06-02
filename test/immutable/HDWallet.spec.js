import { expect } from 'chai'
import * as R from 'ramda'
import * as HDWalletUtil from '../../src/immutable/HDWallet'

const walletFixture = require('../_fixtures/wallet.v3')
const walletNewFixture = require('../_fixtures/wallet-new.v3')

describe('HDWallet', () => {
  const hdWalletFixture = walletFixture.hd_wallets[0]
  const hdWallet = HDWalletUtil.fromJS(hdWalletFixture)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(HDWalletUtil.toJS(hdWallet)).to.deep.equal(hdWalletFixture)
    })
  })

  describe('properties', () => {
    it('should have a seedHex', () => {
      expect(hdWallet.seedHex).to.equal(hdWalletFixture.seed_hex)
    })
  })

  describe('createNew', () => {
    const { wallet, mnemonic } = walletNewFixture
    const hdWallet = HDWalletUtil.createNew(mnemonic)

    it('should generate the correct seed hex', () => {
      expect(hdWallet.seedHex).to.equal(wallet.hd_wallets[0].seed_hex)
    })

    it('should have the correct first account', () => {
      let firstAccount = HDWalletUtil.toJS(hdWallet).accounts[0]
      let accountFixtureNoLabels = R.set(R.lensProp('address_labels'), [], hdWalletFixture.accounts[0])
      expect(firstAccount).to.deep.equal(accountFixtureNoLabels)
    })

    it('should optionally set the first account label', () => {
      let label = 'another label'
      let hdWalletLabelled = HDWalletUtil.createNew(mnemonic, { label })
      let firstAccount = HDWalletUtil.toJS(hdWalletLabelled).accounts[0]
      expect(firstAccount.label).to.equal(label)
    })
  })
})
