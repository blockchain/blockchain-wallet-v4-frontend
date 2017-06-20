import * as A from './actions.js'
import { Wrapper, Wallet, Address, InitialState } from '../../types'
// import { combineReducers } from 'redux-immutable'
import Either from 'data.either'
import { over } from 'ramda'

export const WRAPPER_INITIAL_STATE = Wrapper.fromJS(InitialState.Wrapper)

export const wrapperReducer = (state = WRAPPER_INITIAL_STATE, action) => {
  const { type } = action
  switch (type) {
    case A.SECOND_PASSWORD_ON:
    case A.SECOND_PASSWORD_OFF:
    case A.WALLET_REPLACE: {
      return action.payload
    }
    case A.ADDRESS_ADD: {
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
    case A.ADDRESS_LABEL: {
      const { address, label } = action.payload
      return over(Wrapper.wallet, Wallet.setAddressLabel(address, label), state)
    }
    // TODO :: wallet creation need review
    // case A.WALLET_NEW_SET: {
    //   let { guid, sharedKey, mnemonic } = action.payload
    //   return Wallet.createNew(guid, sharedKey, mnemonic)
    // }
    case A.WALLET_CLEAR: {
      return WRAPPER_INITIAL_STATE
    }
    default:
      return state
  }
}

// // ///////////////////////////////////////////////////////////////////////////
// export const pbkdf2Iterations = (state = 5000, action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return 5000
//     }
//     case A.WALLET_NEW_SET: {
//       return 5000 // intiial-iterations for new wallets
//     }
//     default:
//       return state
//   }
// }

// export const password = (state = '', action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return ''
//     }
//     case A.MAIN_PASSWORD_CHANGE: {
//       return action.payload
//     }
//     case A.WALLET_NEW_SET: {
//       const { password } = action.payload
//       return password
//     }
//     default:
//       return state
//   }
// }

// export const version = (state = 3, action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return 3
//     }
//     case A.WALLET_NEW_SET: {
//       return 3
//     }
//     default:
//       return state
//   }
// }

// export const payloadChecksum = (state = '', action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return ''
//     }
//     case A.PAYLOAD_CHECKSUM_CHANGE: {
//       return action.payload
//     }
//     case A.WALLET_NEW_SET: {
//       return ''
//     }
//     default:
//       return state
//   }
// }

// export const language = (state = 'en', action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return 'en'
//     }
//     case A.WALLET_NEW_SET: {
//       const { language = 'en' } = action.payload
//       return language
//     }
//     default:
//       return state
//   }
// }

// export const syncPubkeys = (state = false, action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return false
//     }
//     case A.WALLET_NEW_SET: {
//       return false
//     }
//     default:
//       return state
//   }
// }

// export const warChecksum = (state = '', action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return ''
//     }
//     case A.WALLET_NEW_SET: {
//       return ''
//     }
//     default:
//       return state
//   }
// }

// export const authType = (state = 0, action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return 0
//     }
//     case A.WALLET_NEW_SET: {
//       return 0
//     }
//     default:
//       return state
//   }
// }

// export const realAuthType = (state = 0, action) => {
//   const { type } = action
//   switch (type) {
//     case A.WALLET_CLEAR: {
//       return 0
//     }
//     case A.WALLET_NEW_SET: {
//       return 0
//     }
//     default:
//       return state
//   }
// }

// const walletReducer = combineReducers({
//   walletImmutable,
//   pbkdf2Iterations,
//   password,
//   version,
//   payloadChecksum,
//   language,
//   syncPubkeys,
//   warChecksum,
//   authType,
//   realAuthType
// })

const walletReducer = wrapperReducer

export default walletReducer
