import { append, assoc, assocPath, concat, merge, path } from 'ramda'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes.js'
import * as actions from '../../actions'
import { descentDraw, ascentDraw, singleRandomDraw, branchAndBound } from '../../../coinSelection'
import * as RD from '../../remoteData'

const EMPTY_SELECTION = {
  fee: undefined,
  inputs: [],
  outputs: []
}

const INITIAL_STATE = {
  addresses: RD.NotAsked(),
  fee: RD.NotAsked(),
  info: RD.NotAsked(),
  latest_block: RD.NotAsked(),
  payment: {
    coins: RD.NotAsked(),
    selection: EMPTY_SELECTION,
    effectiveBalance: undefined
  },
  rates: RD.NotAsked(),
  transactions: RD.NotAsked()
}

const bitcoinReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    // case actionTypes.common.bitcoin.SET_BLOCKCHAIN_DATA: {
    //   return merge(state, payload)
    // }
    // case AT.SET_BITCOIN_LATEST_BLOCK: {
    //   return assocPath(['latest_block'], payload, state)
    // }
    // case AT.SET_BITCOIN_EFFECTIVE_BALANCE: {
    //   const { effectiveBalance } = payload
    //   return assocPath(['payment', 'effectiveBalance'], effectiveBalance, state)
    // }
    // case AT.SET_BITCOIN_SELECTION: {
    //   const { coins, target, feePerByte, change, algorithm, seed } = action.payload

    //   let selection
    //   switch (algorithm) {
    //     case 'ascentDraw':
    //       selection = ascentDraw([target], feePerByte, coins, change)
    //       break
    //     case 'descentDraw':
    //       selection = descentDraw([target], feePerByte, coins, change)
    //       break
    //     case 'singleRandomDraw':
    //       selection = singleRandomDraw([target], feePerByte, coins, change, seed)
    //       break
    //     case 'branchAndBound':
    //       selection = branchAndBound([target], feePerByte, coins, change, seed)
    //       break
    //     default:
    //       selection = EMPTY_SELECTION
    //       break
    //   }

    //   return assocPath(['payment', 'selection'], selection, state)
    // }
    case AT.FETCH_BITCOIN_DATA: {
      const data = {
        addresses: RD.Loading(),
        info: RD.Loading(),
        latest_block: RD.Loading()
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_DATA_SUCCESS: {
      const { addresses, info, latest_block } = payload
      const data = {
        addresses: RD.Success(addresses),
        info: RD.Success(info),
        latest_block: RD.Success(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_DATA_FAILURE: {
      const { addresses, info, latest_block } = payload
      const data = {
        addresses: RD.Failed(addresses),
        info: RD.Failed(info),
        latest_block: RD.Failed(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_FEE: {
      return assoc('fee', RD.Loading(), state)
    }
    case AT.FETCH_BITCOIN_FEE_SUCCESS: {
      return assoc('fee', RD.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_FEE_FAILURE: {
      return assoc('fee', RD.Failed(payload), state)
    }
    case AT.FETCH_BITCOIN_RATES: {
      return assoc('rates', RD.Loading(), state)
    }
    case AT.FETCH_BITCOIN_RATES_SUCCESS: {
      return assoc('rates', RD.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_RATES_FAILURE: {
      return assoc('rates', RD.Failed(payload), state)
    }
    case AT.FETCH_BITCOIN_SELECTION: {
      return assocPath(['payment', 'selection'], RD.Loading(), state)
    }
    case AT.FETCH_BITCOIN_SELECTION_SUCCESS: {
      return assocPath(['payment', 'selection'], RD.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_SELECTION_FAILURE: {
      return assocPath(['payment', 'selection'], RD.Failed(payload), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS: {
      return assoc('transactions', RD.Loading(), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS_SUCCESS: {
      return payload.reset
        ? assoc('transactions', RD.Success(payload), state)
        : assoc('transactions', RD.Success(concat(path('transactions', state), payload)), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS_FAILURE: {
      return assoc('transactions', RD.Failed(payload), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY: {
      return assoc('transaction_history', RD.Loading(), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_SUCCESS: {
      return assoc('transaction_history', RD.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_FAILURE: {
      return assoc('transaction_history', RD.Failed(payload), state)
    }
    case AT.FETCH_BITCOIN_UNSPENT: {
      return assocPath(['payment', 'coins'], RD.Loading(), state)
    }
    case AT.FETCH_BITCOIN_UNSPENT_SUCCESS: {
      return assocPath(['payment', 'coins'], RD.Success(payload), state)
    }
    case AT.FETCH_BITCOIN_UNSPENT_FAILURE: {
      return assocPath(['payment', 'coins'], RD.Failed(payload), state)
    }
    default:
      return state
  }
}

export default bitcoinReducer
