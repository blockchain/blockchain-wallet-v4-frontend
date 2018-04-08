import { assoc, assocPath, merge, lensProp, over, prop, head, append, compose, dropLast } from 'ramda'
import * as AT from './actionTypes'
import { descentDraw, ascentDraw, singleRandomDraw, branchAndBound, selectAll } from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import Remote from '../../../remote'

const EMPTY_SELECTION = {
  fee: undefined,
  inputs: [],
  outputs: []
}

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: Remote.NotAsked,
  latest_block: Remote.NotAsked,
  payment: {
    coins: Remote.NotAsked,
    selection: EMPTY_SELECTION,
    effectiveBalance: undefined
  },
  rates: Remote.NotAsked,
  transactions: [],
  transaction_history: Remote.NotAsked
}

const bchReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    // case AT.SET_BCH_LATEST_BLOCK: {
    //   return assocPath(['latest_block'], payload, state)
    // }
    case AT.REFRESH_BCH_EFFECTIVE_BALANCE: {
      const { coins, feePerByte } = payload
      const { outputs } = selectAll(feePerByte, coins)
      const effectiveBalance = prop('value', head(outputs)) || 0
      return assocPath(['payment', 'effectiveBalance'], effectiveBalance, state)
    }
    case AT.REFRESH_BCH_SELECTION: {
      const { feePerByte, coins, amount, receive, change, algorithm, seed } = payload
      const target = Coin.fromJS({ address: receive, value: amount })

      let selection
      switch (algorithm) {
        case 'ascentDraw': selection = ascentDraw([target], feePerByte, coins, change); break
        case 'descentDraw': selection = descentDraw([target], feePerByte, coins, change); break
        case 'singleRandomDraw': selection = singleRandomDraw([target], feePerByte, coins, change, seed); break
        case 'branchAndBound': selection = branchAndBound([target], feePerByte, coins, change, seed); break
        default: selection = EMPTY_SELECTION
      }
      return assocPath(['payment', 'selection'], selection, state)
    }
    case AT.FETCH_BCH_DATA_LOADING: {
      const data = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading
      }
      return merge(state, data)
    }
    case AT.FETCH_BCH_DATA_SUCCESS: {
      const { addresses, info, latest_block } = payload
      const data = {
        addresses: Remote.Success(addresses),
        info: Remote.Success(info),
        latest_block: Remote.Success(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BCH_DATA_FAILURE: {
      const { addresses, info, latest_block } = payload
      const data = {
        addresses: Remote.Failure(addresses),
        info: Remote.Failure(info),
        latest_block: Remote.Failure(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BCH_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_BCH_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_BCH_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_BCH_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_BCH_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_BCH_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    case AT.FETCH_BCH_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_BCH_TRANSACTIONS_SUCCESS: {
      const { reset, transactions } = payload
      return reset
        ? assoc('transactions', [Remote.Success(transactions)], state)
        : over(lensProp('transactions'), compose(append(Remote.Success(transactions)), dropLast(1)), state)
    }
    case AT.FETCH_BCH_TRANSACTIONS_FAILURE: {
      return over(lensProp('transactions'), dropLast(1), state)
    }
    case AT.FETCH_BCH_TRANSACTION_HISTORY_LOADING: {
      return assoc('transaction_history', Remote.Loading, state)
    }
    case AT.FETCH_BCH_TRANSACTION_HISTORY_SUCCESS: {
      return assoc('transaction_history', Remote.Success(payload), state)
    }
    case AT.FETCH_BCH_TRANSACTION_HISTORY_FAILURE: {
      return assoc('transaction_history', Remote.Failure(payload), state)
    }
    case AT.FETCH_BCH_UNSPENT_LOADING: {
      return assocPath(['payment', 'coins'], Remote.Loading, state)
    }
    case AT.FETCH_BCH_UNSPENT_SUCCESS: {
      return assocPath(['payment', 'coins'], Remote.Success(payload), state)
    }
    case AT.FETCH_BCH_UNSPENT_FAILURE: {
      return assocPath(['payment', 'coins'], Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default bchReducer
