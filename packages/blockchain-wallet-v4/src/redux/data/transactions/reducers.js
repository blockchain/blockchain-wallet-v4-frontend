import * as actionTypes from '../../actionTypes.js'
import * as AT from './actionTypes.js'
import { assoc, assocPath, concat, path, prop, mapObjIndexed } from 'ramda'

const INITIAL_STATE = {
  bitcoin: {
    list: [],
    address: ''
  },
  ethereum: {}
}

const listReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.SET_BITCOIN_TRANSACTIONS: {
      const { address, txs, reset } = payload
      if (reset) {
        return assoc('bitcoin', { address, list: txs }, state)
      } else {
        const currentTxs = path(['bitcoin', 'list'], state)
        return assoc('bitcoin', { address, list: concat(txs, currentTxs) }, state)
      }
    }
    case actionTypes.common.SET_ETHEREUM_DATA: {
      const selectTxns = (num, key, obj) => prop('txns', num)
      return assoc('ethereum', mapObjIndexed(selectTxns, payload), state)
    }
    case AT.SET_ETHEREUM_TRANSACTIONS: {
      const { address, txs } = payload
      return assocPath(['ethereum', address], txs)
    }
    default:
      return state
  }
}

export default listReducer
