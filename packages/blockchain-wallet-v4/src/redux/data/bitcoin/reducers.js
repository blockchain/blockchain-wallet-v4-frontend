import { assoc, assocPath, concat, path } from 'ramda'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes.js'
import { descentDraw, ascentDraw, singleRandomDraw, branchAndBound } from '../../../coinSelection'

const EMPTY_SELECTION = {
  fee: undefined,
  inputs: [],
  outputs: []
}

const INITIAL_STATE = {
  addresses: {},
  fee: {},
  info: {},
  latest_block: {},
  payment: {
    coins: [],
    selection: EMPTY_SELECTION,
    effectiveBalance: 0
  },
  rates: {},
  transactions: {
    address: '',
    list: []
  }
}

const ethereumReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case actionTypes.common.SET_BLOCKCHAIN_DATA: {
      return Object.assign({}, state, payload)
    }
    case AT.SET_FEE: {
      return assoc('fee', payload, state)
    }
    case AT.DELETE_FEE: {
      return assoc('fee', {}, state)
    }
    case AT.SET_LATEST_BLOCK: {
      return assocPath(['latest_block'], payload, state)
    }
    case AT.SET_UNSPENT: {
      const { coins } = payload
      return assocPath(['payment', 'coins'], coins, state)
    }
    case AT.SET_EFFECTIVE_BALANCE: {
      const { effectiveBalance } = payload
      return assocPath(['payment', 'effectiveBalance'], effectiveBalance, state)
    }
    case AT.SET_SELECTION: {
      const { coins, target, feePerByte, change, algorithm, seed } = action.payload

      let selection
      switch (algorithm) {
        case 'ascentDraw':
          selection = ascentDraw([target], feePerByte, coins, change)
          break
        case 'descentDraw':
          selection = descentDraw([target], feePerByte, coins, change)
          break
        case 'singleRandomDraw':
          selection = singleRandomDraw([target], feePerByte, coins, change, seed)
          break
        case 'branchAndBound':
          selection = branchAndBound([target], feePerByte, coins, change, seed)
          break
        default:
          selection = EMPTY_SELECTION
          break
      }

      return assocPath(['payment', 'selection'], selection, state)
    }
    case AT.SET_BITCOIN_RATES: {
      return assoc('rates', payload, state)
    }
    case AT.SET_TRANSACTION_FIAT_AT_TIME: {
      const { currency, hash, value } = payload
      return assocPath(['transactions_fiat', hash, currency], value, state)
    }
    case AT.SET_BITCOIN_TRANSACTIONS: {
      const { address, txs, reset } = payload
      if (reset) {
        return assoc('transactions', { address, list: txs }, state)
      } else {
        const currentTxs = path(['transactions', 'list'], state)
        return assoc('transactions', { address, list: concat(txs, currentTxs) }, state)
      }
    }
    default:
      return state
  }
}

export default ethereumReducer
