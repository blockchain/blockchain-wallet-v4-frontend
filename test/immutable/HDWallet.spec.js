import { expect } from 'chai'
import * as HDWalletUtil from '../../src/immutable/HDWallet'

const walletFixture = require('../_fixtures/wallet.v3')

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
})
