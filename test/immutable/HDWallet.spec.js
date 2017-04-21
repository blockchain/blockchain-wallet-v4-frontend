import { expect } from 'chai'
import HDWallet, * as HDWalletUtil from '../../src/immutable/Address'

const walletFixture = require('../_fixtures/wallet.v3')

describe('HDWallet', () => {
  const hdWalletFixture = walletFixture.hd_wallets[0]
  const hdWallet = new HDWallet(hdWalletFixture)

  describe('toJS', () => {
    it('should return the correct object', () => {
      expect(HDWalletUtil.toJS(hdWallet)).to.deep.equal(hdWalletFixture)
    })
  })
})
