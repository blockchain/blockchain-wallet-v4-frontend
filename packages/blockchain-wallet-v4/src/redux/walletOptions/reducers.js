import * as AT from './actionTypes'

// TODO: once getWalletOptions is working implement default object for failure
const INITIAL_STATE = {}

const walletOptionsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_WALLET_OPTIONS: {
      const { data } = payload
      return data
    }
    default:
      return state
  }
}

export default walletOptionsReducer
