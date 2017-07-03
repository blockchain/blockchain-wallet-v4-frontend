import * as T from './actionTypes.js'
import { Wrapper, Wallet, Address, InitialState } from '../../types'
import Either from 'data.either'
import { over, set } from 'ramda'

export const WRAPPER_INITIAL_STATE = Wrapper.fromJS(InitialState.Wrapper)

export const wrapperReducer = (state = WRAPPER_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case T.SECOND_PASSWORD_ON:
    case T.SECOND_PASSWORD_OFF:
    case T.WALLET_REPLACE: {
      return action.payload
    }
    case T.ADDRESS_ADD: {
      const { address, secondPassword } = action.payload
      const a = Address.fromJS(address)
      const addMyAddress = w => Wallet.addAddress(w, a, secondPassword)
      // this should be handled on a saga. No eithers in reducers
      const eitherWrapper = Wrapper.traverseWallet(Either.of, addMyAddress, state)
      if (eitherWrapper.isRight) {
        return eitherWrapper.value
      } else {
        return state
      }
    }
    case T.ADDRESS_LABEL: {
      const { address, label } = action.payload
      return over(Wrapper.wallet, Wallet.setAddressLabel(address, label), state)
    }
    case T.SET_PAYLOAD_CHECKSUM: {
      const checksum = action.payload
      return set(Wrapper.payloadChecksum, checksum, state)
    }
    case T.WALLET_NEW_SET: {
      let { guid, sharedKey, mnemonic, label, password } = action.payload
      return Wrapper.createNew(guid, password, sharedKey, mnemonic, label)
    }
    case T.WALLET_CLEAR: {
      return WRAPPER_INITIAL_STATE
    }
    default:
      return state
  }
}

const walletReducer = wrapperReducer

export default walletReducer
