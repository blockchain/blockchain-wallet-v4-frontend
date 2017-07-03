import { expect } from 'chai'
import { compose } from 'ramda'
import { Wrapper, Wallet, AddressMap } from '../../src/types'
import walletReducer from '../../src/redux/wallet/reducers.js'
import * as Actions from '../../src/redux/wallet/actions.js'
const walletFixture = require('../_fixtures/Wallet/wallet.v3')

const wrap = wallet => ({
  sync_pubkeys: false,
  payload_checksum: 'payload_checksum',
  storage_token: 'storage_token',
  version: 3,
  language: 'en',
  wallet: wallet,
  war_checksum: 'war_checksum',
  password: 'password',
  pbkdf2_iterations: 5000
})

describe('reducers', () => {
  describe('wallet', () => {
    const wrapped = Wrapper.fromJS(wrap(walletFixture))

    it('should handle WALLET_LOAD', () => {
      let action = Actions.replaceWallet(wrapped)
      let next = walletReducer(void 0, action)
      expect(next).to.equal(wrapped)
    })

    it('should handle SECOND_PASSWORD_ON', () => {
      let action = Actions.secondPasswordOn(wrapped)
      let next = walletReducer(void 0, action)
      expect(next).to.equal(wrapped)
    })

    it('should handle SECOND_PASSWORD_OFF', () => {
      let action = Actions.secondPasswordOff(wrapped)
      let next = walletReducer(void 0, action)
      expect(next).to.equal(wrapped)
    })

    it('should handle ADDRESS_ADD', () => {
      let action = Actions.addAddress(walletFixture.keys[0], null)
      let next = walletReducer(void 0, action)
      const sa = compose(Wallet.selectAddresses, Wrapper.selectWallet)
      expect(sa(next).size).to.equal(1)
    })

    it('should handle ADDRESS_LABEL', () => {
      let label = 'my new label'
      let action = Actions.addLabel('19XmKRY66VnUn5irHAafyoTfiwFuGLUxKF', label)
      let next = walletReducer(wrapped, action)
      const sa = compose(AddressMap.selectAddress('19XmKRY66VnUn5irHAafyoTfiwFuGLUxKF'), Wallet.selectAddresses, Wrapper.selectWallet)
      expect(sa(next).label).to.equal(label)
    })

    it('should handle HD_ADDRESS_LABEL_SET', () => {
      let label = 'changed_label'
      let action = Actions.setHdAddressLabel(0, 0, label)
      let next = walletReducer(wrapped, action)
      let select = compose(Wallet.toJS, Wrapper.selectWallet)
      expect(select(next).hd_wallets[0].accounts[0].address_labels[0].label).to.equal(label)
    })

    it('should handle HD_ADDRESS_LABEL_REMOVE', () => {
      let action = Actions.removeHdAddressLabel(0, 0)
      let next = walletReducer(wrapped, action)
      let select = compose(Wallet.toJS, Wrapper.selectWallet)
      expect(select(next).hd_wallets[0].accounts[0].address_labels).to.have.length.of(0)
    })

    // TODO :: wallet creation need review
    // it('should handle WALLET_NEW_SET', () => {
    //   let { wallet, mnemonic } = walletNewFixture
    //   let action = Actions.setNewWallet(wallet.guid, wallet.sharedKey, mnemonic)
    //   let next = walletImmutable(void 0, action)
    //   expect(Wallet.toJS(next)).to.deep.equal(wallet)
    // })
  })
})
