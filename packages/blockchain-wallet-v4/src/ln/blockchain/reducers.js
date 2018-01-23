import * as T from './actionTypes'

// The state is a mapping of public key to connection objects
const INITIAL_STATE = {}

const NOT_PUSHED = 0
const WAITING_FOR_CONFIRMATIONS = 1
const CONFIRMED = 2

const blockchainPollerReducer = (state = INITIAL_STATE, action) => {
  const { type, txHex, requiredConfirmations } = action

  switch (type) {
    case T.ADD_TRANSACTION: {
      let copy = Object.assign({}, state)
      if (copy[txHex] !== undefined) {
        console.warning('transaction already added')
        return state
      }
      copy[txHex] = {
        status: NOT_PUSHED,
        required_confirmations: requiredConfirmations
      }
      return copy
    }

    case T.TRANSACTION_PUSHED: {
      let copy = Object.assign({}, state)
      if (copy[txHex] === undefined) {
        console.warning('transaction not added yet')
        return state
      }
      copy[txHex].status = WAITING_FOR_CONFIRMATIONS
      return copy
    }

    case T.TRANSACTION_CONFIRMED: {
      let copy = Object.assign({}, state)
      if (copy[txHex] === undefined) {
        console.warning('transaction not added yet')
        return state
      }
      copy[txHex].status = CONFIRMED
      return copy
    }

    default: return state
  }
}

export default blockchainPollerReducer
