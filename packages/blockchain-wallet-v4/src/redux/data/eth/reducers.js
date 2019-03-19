import {
  assoc,
  assocPath,
  mergeRight,
  reduce,
  lensPath,
  over,
  append,
  compose,
  dropLast,
  path,
  prop,
  prepend
} from 'ramda'
import * as AT from './actionTypes'
import Remote from '../../../remote'
import { SUPPORTED_ERC20_TOKENS } from './model'

const createNotAskedState = reduce(
  (acc, curr) => assoc(curr, Remote.NotAsked, acc),
  {}
)
const createLoadingState = reduce(
  (acc, curr) => assoc(curr, Remote.Loading, acc),
  {}
)
const createTxState = reduce((acc, curr) => assoc(curr, [], acc), {})
const createTxAtBoundsState = reduce((acc, curr) => assoc(curr, false, acc), {})

const coinAndTokens = prepend('eth', SUPPORTED_ERC20_TOKENS)

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: createNotAskedState(coinAndTokens),
  latest_block: Remote.NotAsked,
  current_balance: createNotAskedState(coinAndTokens),
  legacy_balance: Remote.NotAsked,
  rates: Remote.NotAsked,
  transactions: createTxState(coinAndTokens),
  transactions_at_bound: createTxAtBoundsState(coinAndTokens)
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_ETHEREUM_DATA_LOADING: {
      const newState = {
        addresses: Remote.Loading,
        info: createLoadingState(coinAndTokens),
        latest_block: Remote.Loading
      }
      return mergeRight(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_SUCCESS: {
      const newState = {
        addresses: Remote.Success(prop('addresses', payload)),
        info: { eth: Remote.Success(path(['info', 'eth'], payload)) },
        latest_block: Remote.Success(prop('latest_block', payload))
      }
      return mergeRight(state, newState)
    }
    case AT.FETCH_ETHEREUM_DATA_FAILURE: {
      const newState = {
        addresses: Remote.Failure(prop('addresses', payload)),
        info: { eth: Remote.Failure(path('info', 'eth', payload)) },
        latest_block: Remote.Failure(prop('latest_block', payload))
      }
      return mergeRight(state, newState)
    }
    case AT.FETCH_ETHEREUM_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_LOADING: {
      return state
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_SUCCESS: {
      return assoc('latest_block', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_LATEST_BLOCK_FAILURE: {
      return assoc('latest_block', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_LEGACY_BALANCE_LOADING: {
      return assoc('legacy_balance', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_LEGACY_BALANCE_SUCCESS: {
      const { balance } = payload
      return assoc('legacy_balance', Remote.Success(balance), state)
    }
    case AT.FETCH_ETHEREUM_LEGACY_BALANCE_FAILURE: {
      return assoc('legacy_balance', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_CURRENT_BALANCE_LOADING: {
      return assocPath(['current_balance', 'eth'], Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_CURRENT_BALANCE_SUCCESS: {
      const { balance } = payload
      return assocPath(
        ['current_balance', 'eth'],
        Remote.Success(balance),
        state
      )
    }
    case AT.FETCH_ETHEREUM_CURRENT_BALANCE_FAILURE: {
      return assoc('current_balance', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_LOADING: {
      return assoc('rates', Remote.Loading, state)
    }
    case AT.FETCH_ETHEREUM_RATES_SUCCESS: {
      return assoc('rates', Remote.Success(payload), state)
    }
    case AT.FETCH_ETHEREUM_RATES_FAILURE: {
      return assoc('rates', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assocPath(['transactions', 'eth'], [Remote.Loading], state)
        : over(lensPath(['transactions', 'eth']), append(Remote.Loading), state)
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_SUCCESS: {
      const { transactions, reset } = payload
      return reset
        ? assocPath(
            ['transactions', 'eth'],
            [Remote.Success(transactions)],
            state
          )
        : over(
            lensPath(['transactions', 'eth']),
            compose(
              append(Remote.Success(transactions)),
              dropLast(1)
            ),
            state
          )
    }
    case AT.FETCH_ETHEREUM_TRANSACTIONS_FAILURE: {
      return assocPath(
        ['transactions', 'eth'],
        [Remote.Failure(payload)],
        state
      )
    }
    case AT.ETH_TRANSACTIONS_AT_BOUND: {
      return assocPath(['transactions', 'eth'], payload, state)
    }
    default:
      return state
  }
}
