import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'

const resetWallet2faReducer = (state = Remote.NotAsked, { payload, type }) => {
  switch (type) {
    case AT.RESET_WALLET_2FA_LOADING: {
      return Remote.Loading
    }
    case AT.RESET_WALLET_2FA_SUCCESS: {
      return Remote.Success(payload)
    }
    case AT.RESET_WALLET_2FA_FAILURE: {
      return Remote.Failure(payload)
    }
    case AT.RESET_WALLET_2FA_NOTASKED: {
      return Remote.NotAsked
    }
    default:
      return state
  }
}

export default resetWallet2faReducer
