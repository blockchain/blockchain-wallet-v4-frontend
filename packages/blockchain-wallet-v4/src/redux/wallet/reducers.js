import { over, set } from 'ramda-lens'
import { compose } from 'ramda'

import * as T from './actionTypes.js'
import { Wrapper, Wallet, Options, HDWallet, HDWalletList } from '../../types'

export const WRAPPER_INITIAL_STATE = Wrapper.fromJS(
  Wrapper.createNewReadOnly('', '')
)

export const wrapperReducer = (state = WRAPPER_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    // Merge wrapper from the Main Process.
    case T.MERGE_WRAPPER: {
      const redactedWrapper = Wrapper.redact(action.payload)
      return state.mergeDeep(redactedWrapper)
    }
    case T.SET_PAYLOAD_CHECKSUM: {
      const checksum = action.payload
      return set(Wrapper.payloadChecksum, checksum, state)
    }
    case T.REFRESH_WRAPPER:
    case T.SET_WRAPPER: {
      return action.payload
    }
    case T.DELETE_WRAPPER: {
      return WRAPPER_INITIAL_STATE
    }
    case T.SET_LEGACY_ADDRESS_LABEL: {
      const { address, label } = action.payload
      return over(
        Wrapper.wallet,
        Wallet.setLegacyAddressLabel(address, label),
        state
      )
    }
    case T.SET_ADDRESS_ARCHIVED: {
      const { address, archived } = action.payload
      return over(
        Wrapper.wallet,
        Wallet.setAddressArchived(address, archived),
        state
      )
    }
    case T.SET_AUTOLOGOUT: {
      const { time } = action.payload
      return over(
        compose(
          Wrapper.wallet,
          Wallet.options
        ),
        Options.setLogoutTime(time),
        state
      )
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
      return over(
        Wrapper.wallet,
        Wallet.setHdAddressLabel(accountIdx, addressIdx, label),
        state
      )
    }
    case T.DELETE_HD_ADDRESS_LABEL: {
      const { accountIdx, addressIdx } = action.payload
      return over(
        Wrapper.wallet,
        Wallet.deleteHdAddressLabel(accountIdx, addressIdx),
        state
      )
    }
    case T.SET_ACCOUNT_LABEL: {
      const { accountIdx, label } = action.payload
      return over(
        Wrapper.wallet,
        Wallet.setAccountLabel(accountIdx, label),
        state
      )
    }
    case T.SET_ACCOUNT_ARCHIVED: {
      const { accountIdx, archived } = action.payload
      return over(
        Wrapper.wallet,
        Wallet.setAccountArchived(accountIdx, archived),
        state
      )
    }
    case T.SET_DEFAULT_ACCOUNT: {
      const { index } = action.payload
      return over(Wrapper.wallet, Wallet.setDefaultAccountIdx(index), state)
    }
    case T.SET_TRANSACTION_NOTE: {
      const { txHash, txNote } = action.payload
      return over(Wrapper.wallet, Wallet.setTxNote(txHash, txNote), state)
    }
    case T.SET_SYNC_PUB_KEYS: {
      const { syncPubKeys } = action.payload
      return set(Wrapper.syncPubKeys, syncPubKeys, state)
    }
    case T.VERIFY_MNEMONIC: {
      const mvLens = compose(
        Wrapper.wallet,
        Wallet.hdWallets,
        HDWalletList.hdwallet,
        HDWallet.mnemonicVerified
      )
      return set(mvLens, true, state)
    }
    default:
      return state
  }
}

const walletReducer = wrapperReducer

export default walletReducer
