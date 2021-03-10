import { compose } from 'ramda'

import { AddressMap, Wallet, Wrapper } from '../../types'
import * as Actions from './actions'
import walletReducer from './reducers'

const wrapperFixture = require('../../types/__mocks__/wrapper.v4')

describe('reducers', () => {
  describe('wallet', () => {
    const wrapped = Wrapper.fromJS(wrapperFixture)

    it('should handle SET_WRAPPER', () => {
      let action = Actions.setWrapper(wrapped)
      let next = walletReducer(void 0, action)
      expect(next).toEqual(wrapped)
    })

    // it('should handle TOGGLE_SECOND_PASSWORD_SUCCESS ON', () => {
    //   let action = Actions.toggleSecondPasswordSuccess(wrapped)
    //   let next = walletReducer(void 0, action)
    //   expect(next).toEqual(wrapped)
    // })
    //
    // it('should handle CREATE_LEGACY_ADDRESS', () => {
    //   let action = Actions.createAddressSuccess(wrapped)
    //   let next = walletReducer(void 0, action)
    //   expect(next).toEqual(wrapped)
    // })

    it('should handle SET_LEGACY_ADDRESS_LABEL', () => {
      let label = 'my new label'
      let action = Actions.setLegacyAddressLabel(
        '19XmKRY66VnUn5irHAafyoTfiwFuGLUxKF',
        label
      )
      let next = walletReducer(wrapped, action)
      const sa = compose(
        AddressMap.selectAddress('19XmKRY66VnUn5irHAafyoTfiwFuGLUxKF'),
        Wallet.selectAddresses,
        Wrapper.selectWallet
      )
      expect(sa(next).label).toEqual(label)
    })

    it('should handle SET_HD_ADDRESS_LABEL', () => {
      let label = 'changed_label'
      let action = Actions.setHdAddressLabel(0, 0, 'legacy', label)
      let next = walletReducer(wrapped, action)
      let select = compose(Wallet.toJS, Wrapper.selectWallet)
      expect(
        select(next).hd_wallets[0].accounts[0].derivations[0].address_labels[0]
          .label
      ).toEqual(label)
    })

    it('should handle DELETE_HD_ADDRESS_LABEL', () => {
      let action = Actions.deleteHdAddressLabel(0, 0, 'legacy')
      let next = walletReducer(wrapped, action)
      let select = compose(Wallet.toJS, Wrapper.selectWallet)
      expect(
        select(next).hd_wallets[0].accounts[0].derivations[0].address_labels
          .length
      ).toEqual(0)
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
