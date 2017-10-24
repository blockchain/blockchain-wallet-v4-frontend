import * as T from './actionTypes.js'
import { assoc, concat, path } from 'ramda'

const INITIAL_STATE = {
  bitcoin: {
    list: [],
    address: ''
  },
  ethereum: {
    list: [],
    address: ''
  }
}

const listReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case T.SET_BITCOIN_TRANSACTIONS: {
      const { address, txs, reset } = payload
      if (reset) {
        return assoc('bitcoin', { address, list: txs }, state)
      } else {
        const currentTxs = path(['bitcoin', 'list'], state)
        return assoc('bitcoin', { address, list: concat(txs, currentTxs) }, state)
      }
    }
    case T.SET_ETHEREUM_TRANSACTIONS: {
      const { address, txs } = payload
      const currentTxs = path(['ethereum', 'list'], state)
      return assoc('ethereum', { address, list: concat(txs, currentTxs) }, state)
    }
    default:
      return state
  }
}

export default listReducer
