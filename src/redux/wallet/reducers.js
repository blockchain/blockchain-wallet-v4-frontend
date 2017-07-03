import * as T from './actionTypes.js'
import { Wrapper, Wallet, Address, InitialState, HDWallet, HDAccount } from '../../types'
import { iLensProp } from '../../types/util'
import Either from 'data.either'
import { over, compose, set } from 'ramda'

export const WRAPPER_INITIAL_STATE = Wrapper.fromJS(InitialState.Wrapper)

export const wrapperReducer = (state = WRAPPER_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case T.SET_PAYLOAD_CHECKSUM: {
      const checksum = action.payload
      return set(Wrapper.payloadChecksum, checksum, state)
    }
    case T.SET_WRAPPER: {
      return action.payload
    }
    case T.DELETE_WRAPPER: {
      return WRAPPER_INITIAL_STATE
    }
    case T.CREATE_WALLET_SUCCESS: {
      let { guid, sharedKey, mnemonic, label, password } = action.payload
      return Wrapper.createNew(guid, password, sharedKey, mnemonic, label)
    }
    case T.TOGGLE_SECOND_PASSWORD_SUCCESS:
    case T.CREATE_ADDRESS_SUCCESS: {
      const { wallet } = action.payload
      return wallet
    }
    case T.SET_LEGACY_ADDRESS_LABEL: {
      const { address, label } = action.payload
      return over(Wrapper.wallet, Wallet.setAddressLabel(address, label), state)
    }
    case T.SET_MAIN_PASSWORD: {
      const { password } = action.payload
      return set(Wrapper.password, password, state)
    }
    case T.HD_ADDRESS_LABEL_SET: {
      let { accountIdx, addressIdx, label } = action.payload
      let accountLens = compose(Wallet.hdWallets, iLensProp('0'), HDWallet.accounts, iLensProp(accountIdx.toString()))
      let setLabel = (wallet) => Either.of(over(accountLens, HDAccount.setAddressLabel(addressIdx, label), wallet))
      let eitherWrapper = Wrapper.traverseWallet(Either.of, setLabel, state)
      return eitherWrapper.isRight ? eitherWrapper.value : state
    }
    case T.HD_ADDRESS_LABEL_REMOVE: {
      let { accountIdx, addressIdx } = action.payload
      let accountLens = compose(Wallet.hdWallets, iLensProp('0'), HDWallet.accounts, iLensProp(accountIdx.toString()))
      let setLabel = (wallet) => Either.of(over(accountLens, HDAccount.removeAddressLabel(addressIdx), wallet))
      let eitherWrapper = Wrapper.traverseWallet(Either.of, setLabel, state)
      return eitherWrapper.isRight ? eitherWrapper.value : state
    }
    default:
      return state
  }
}

const walletReducer = wrapperReducer

export default walletReducer
