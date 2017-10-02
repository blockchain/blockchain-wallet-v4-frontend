import * as AT from './actionTypes'

// TODO: once getWalletOptions is working implement default object for failure
const INITIAL_STATE = {}

const walletOptionsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_WALLET_OPTIONS_SUCCESS: {
      return payload
    }
    default:
      return state
  }
}

export default walletOptionsReducer
