import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'

const remindWalletGuidReducer = (state = Remote.NotAsked, { payload, type }) => {
  switch (type) {
    case AT.REMIND_WALLET_GUID_LOADING: {
      return Remote.Loading
    }
    case AT.REMIND_WALLET_GUID_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.REMIND_WALLET_GUID_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.REMIND_WALLET_GUID_NOTASKED: {
      return Remote.NotAsked
    }
    default:
      return state
  }
}

export default remindWalletGuidReducer
