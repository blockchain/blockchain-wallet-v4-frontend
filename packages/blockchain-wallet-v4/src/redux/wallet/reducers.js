import * as T from './actionTypes.js'
import { Wrapper, Wallet, Options, HDWallet, HDWalletList } from '../../types'
import { over, set, view } from 'ramda-lens'
import { compose } from 'ramda'

export const WRAPPER_INITIAL_STATE = Wrapper.fromJS(Wrapper.createNewReadOnly('', ''))

export const wrapperReducer = (state = WRAPPER_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case T.SET_PAYLOAD_CHECKSUM: {
      const checksum = action.payload
      return set(Wrapper.payloadChecksum, checksum, state)
    }
    case T.CHANGE_SECOND_PASSWORD_SUCCESS:
    case T.CREATE_LEGACY_ADDRESS_SUCCESS:
    case T.TOGGLE_SECOND_PASSWORD_SUCCESS:
    case T.CREATE_TREZOR_WALLET_SUCCESS:
    case T.SET_PBKDF2_ITERATIONS_SUCCESS:
    case T.SET_WRAPPER: {
      return action.payload
    }
    case T.DELETE_WRAPPER: {
      return WRAPPER_INITIAL_STATE
    }
    case T.RESTORE_WALLET_SUCCESS:
    case T.CREATE_WALLET_SUCCESS: {
      const { guid, sharedKey, mnemonic, label, password, nAccounts } = action.payload
      return Wrapper.createNew(guid, password, sharedKey, mnemonic, label, nAccounts)
    }
    case T.SET_LEGACY_ADDRESS_LABEL: {
      const { address, label } = action.payload
      return over(Wrapper.wallet, Wallet.setLegacyAddressLabel(address, label), state)
    }
    case T.SET_AUTOLOGOUT: {
      const { time } = action.payload
      return over(compose(Wrapper.wallet, Wallet.options), Options.setLogoutTime(time), state)
    }
    case T.DELETE_LEGACY_ADDRESS: {
      const address = action.payload
      return over(Wrapper.wallet, Wallet.deleteLegacyAddress(address), state)
    }
    case T.SET_MAIN_PASSWORD: {
      const password = action.payload
      return set(Wrapper.password, password, state)
    }
    case T.SET_HD_ADDRESS_LABEL: {
      let { accountIdx, addressIdx, label } = action.payload
      return over(Wrapper.wallet, Wallet.setHdAddressLabel(accountIdx, addressIdx, label), state)
    }
    case T.DELETE_HD_ADDRESS_LABEL: {
      const { accountIdx, addressIdx } = action.payload
      return over(Wrapper.wallet, Wallet.deleteHdAddressLabel(accountIdx, addressIdx), state)
    }
    case T.VERIFY_MNEMONIC: {
      const mvLens = compose(Wrapper.wallet,
                             Wallet.hdWallets,
                             HDWalletList.hdwallet,
                             HDWallet.mnemonicVerified)
      return set(mvLens, true, state)
    }
    default:
      return state
  }
}

const walletReducer = wrapperReducer

export default walletReducer
