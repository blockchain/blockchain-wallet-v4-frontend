// @flow
import { assoc, assocPath, merge, lensProp, over, prop, head, append, compose, dropLast } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'
import { descentDraw, ascentDraw, singleRandomDraw, branchAndBound, selectAll } from '../../../coinSelection'
import * as Coin from '../../../coinSelection/coin'
import Remote from '../../../remote'
import type {RemoteI} from "../../../remote";
import type {ActionCreatorObj} from '../../../utils/types'

export type ActionsT = ActionCreatorObj<typeof A>

const EMPTY_SELECTION = {
  fee: undefined,
  inputs: [],
  outputs: []
}

export type Payment = {
  coins: RemoteI<any>,
  selection: typeof EMPTY_SELECTION,
  effectiveBalance: ?number
}

export type BitcoinStateT = {|
  addresses: RemoteI<string[]>,
  fee: RemoteI<number>,
  info: RemoteI<Object>,
  latest_block: RemoteI<Object>,
  payment: Payment,
  rates: RemoteI<number>,
  transactions: Object[],
  transactions_fiat: Object,
  transaction_history: RemoteI<Object[]>
|}

const INITIAL_STATE: BitcoinStateT = {
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
  transactions_fiat: {},
  transaction_history: Remote.NotAsked
}

export default (state: BitcoinStateT = INITIAL_STATE, action: ActionsT): BitcoinStateT => {
  switch (action.type) {
    case AT.SET_BITCOIN_LATEST_BLOCK: {
      return assocPath(['latest_block'], Remote.Success(action.payload), state)
    }
    case AT.REFRESH_BITCOIN_EFFECTIVE_BALANCE: {
      const { coins, feePerByte } = action.payload
      const { outputs } = selectAll(feePerByte, coins)
      const effectiveBalance = prop('value', head(outputs)) || 0
      return assocPath(['payment', 'effectiveBalance'], effectiveBalance, state)
    }
    case '@CORE.REFRESH_BITCOIN_SELECTION': {
      const payload = action.payload
      const { feePerByte, coins, amount, receive, change, algorithm, seed } = action.payload
      const target = Coin.fromJS({ address: receive, value: amount })

      let selection
      switch (algorithm) {
        case 'ascentDraw': selection = ascentDraw([target], feePerByte, coins, change); break
        case 'descentDraw': selection = descentDraw([target], feePerByte, coins, change); break
        case 'singleRandomDraw': selection = singleRandomDraw([target], feePerByte, coins, change, seed); break
        case 'branchAndBound': selection = branchAndBound([target], feePerByte, coins, change, seed); break
        case 'selectAll': selection = selectAll(5, coins, target.address); break
        default: selection = EMPTY_SELECTION
      }
      return assocPath(['payment', 'selection'], selection, state)
    }
    case AT.FETCH_BITCOIN_DATA_LOADING: {
      const data = {
        addresses: Remote.Loading,
        info: Remote.Loading,
        latest_block: Remote.Loading
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_DATA_SUCCESS: {
      const { addresses, info, latest_block } = action.payload
      const data = {
        addresses: Remote.Success(addresses),
        info: Remote.Success(info),
        latest_block: Remote.Success(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_DATA_FAILURE: {
      const { addresses, info, latest_block } = action.payload
      const data = {
        addresses: Remote.Failure(addresses),
        info: Remote.Failure(info),
        latest_block: Remote.Failure(latest_block)
      }
      return merge(state, data)
    }
    case AT.FETCH_BITCOIN_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(action.payload), state)
    }
    case AT.FETCH_BITCOIN_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(action.payload), state)
    }
    case AT.FETCH_BITCOIN_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(action.payload), state)
    }
    case AT.FETCH_BITCOIN_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(action.payload), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS_LOADING: {
      const { reset } = action.payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS_SUCCESS: {
      const { reset, transactions } = action.payload
      return reset
        ? assoc('transactions', [Remote.Success(transactions)], state)
        : over(lensProp('transactions'), compose(append(Remote.Success(transactions)), dropLast(1)), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTIONS_FAILURE: {
      return over(lensProp('transactions'), dropLast(1), state)
    }
    case AT.FETCH_BITCOIN_FIAT_AT_TIME_LOADING: {
      const { hash, currency } = action.payload
      return assocPath(['transactions_fiat', hash, currency], Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_FIAT_AT_TIME_SUCCESS: {
      const { hash, currency, data } = action.payload
      return assocPath(['transactions_fiat', hash, currency], Remote.Success(data), state)
    }
    case AT.FETCH_BITCOIN_FIAT_AT_TIME_FAILURE: {
      const { hash, currency, error } = action.payload
      return assocPath(['transactions_fiat', hash, currency], Remote.Success(error), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_LOADING: {
      return assoc('transaction_history', Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_SUCCESS: {
      return assoc('transaction_history', Remote.Success(action.payload), state)
    }
    case AT.FETCH_BITCOIN_TRANSACTION_HISTORY_FAILURE: {
      return assoc('transaction_history', Remote.Failure(action.payload), state)
    }
    case AT.FETCH_BITCOIN_UNSPENT_LOADING: {
      return assocPath(['payment', 'coins'], Remote.Loading, state)
    }
    case AT.FETCH_BITCOIN_UNSPENT_SUCCESS: {
      return assocPath(['payment', 'coins'], Remote.Success(action.payload), state)
    }
    case AT.FETCH_BITCOIN_UNSPENT_FAILURE: {
      return assocPath(['payment', 'coins'], Remote.Failure(action.payload), state)
    }
    default:
      return state
  }
}
