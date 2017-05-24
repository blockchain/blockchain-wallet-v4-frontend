import { expect } from 'chai'
import { Map } from 'immutable-ext'
import * as WalletUtil from '../../src/immutable/Wallet'
import * as Actions from '../../src/actions'
import { walletImmutable } from '../../src/reducers/walletReducer'

const walletFixture = require('../_fixtures/wallet.v3')
const walletNewFixture = require('../_fixtures/wallet-new.v3')

describe('walletReducer', () => {
  describe('walletImmutable', () => {
    const wallet = WalletUtil.fromJS(walletFixture)

    it('should handle WALLET_LOAD', () => {
      let action = Actions.loadWallet(Map({ walletImmutable: wallet }))
      let next = walletImmutable(void 0, action)
      expect(next).to.equal(wallet)
    })

    it('should handle SECOND_PASSWORD_ON', () => {
      let action = Actions.secondPasswordOn(wallet)
      let next = walletImmutable(void 0, action)
      expect(next).to.equal(wallet)
    })

    it('should handle SECOND_PASSWORD_OFF', () => {
      let action = Actions.secondPasswordOff(wallet)
      let next = walletImmutable(void 0, action)
      expect(next).to.equal(wallet)
    })

    it('should handle ADDRESS_ADD', () => {
      let action = Actions.addAddress(walletFixture.keys[0], null)
      let next = walletImmutable(void 0, action)
      expect(WalletUtil.selectAddresses(next).length).to.equal(1)
    })

    it('should handle ADDRESS_LABEL', () => {
      let label = 'my new label'
      let action = Actions.addLabel('19XmKRY66VnUn5irHAafyoTfiwFuGLUxKF', label)
      let next = walletImmutable(wallet, action)
      expect(WalletUtil.selectAddresses(next)[0].label).to.equal(label)
    })

    it('should handle WALLET_NEW_SET', () => {
      let { wallet, mnemonic } = walletNewFixture
      let action = Actions.setNewWallet(wallet.guid, wallet.sharedKey, mnemonic)
      let next = walletImmutable(void 0, action)
      expect(WalletUtil.toJS(next)).to.deep.equal(wallet)
    })
  })
})
