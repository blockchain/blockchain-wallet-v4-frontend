import {
  append,
  assoc,
  assocPath,
  compose,
  dropLast,
  lensPath,
  mergeRight,
  over,
  path,
  prop
} from 'ramda'
import { mapped } from 'ramda-lens'

import Remote from '../../../remote'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  addresses: Remote.NotAsked,
  current_balance: {},
  erc20s: Remote.NotAsked,
  fee: Remote.NotAsked,
  info: { eth: Remote.NotAsked },
  latest_block: Remote.NotAsked,
  legacy_balance: Remote.NotAsked,
  rates: { eth: Remote.NotAsked },
  transaction_history: { eth: Remote.NotAsked },
  transactions: { eth: [] },
  transactions_at_bound: { eth: false },
  warn_low_eth_balance: false
}

export default (state = INITIAL_STATE, action) => {
  const { payload, type } = action
  switch (type) {
    // ETH
    case AT.FETCH_ETH_DATA_LOADING: {
      const newState = {
        addresses: Remote.Loading,
        info: {
          ...state.info,
          eth: Remote.Loading
        },
        latest_block: Remote.Loading
      }
      return mergeRight(state, newState)
    }
    case AT.FETCH_ETH_DATA_SUCCESS: {
      const newState = {
        addresses: Remote.Success(prop('addresses', payload)),
        info: {
          ...state.info,
          eth: Remote.Success(path(['info', 'eth'], payload))
        },
        latest_block: Remote.Success(prop('latest_block', payload))
      }
      return mergeRight(state, newState)
    }
    case AT.FETCH_ETH_DATA_FAILURE: {
      const newState = {
        addresses: Remote.Failure(prop('addresses', payload)),
        info: {
          ...state.info,
          // @ts-ignore
          eth: Remote.Failure(path('info', 'eth', payload))
        },
        latest_block: Remote.Failure(prop('latest_block', payload))
      }
      return mergeRight(state, newState)
    }
    case AT.FETCH_ETH_FEE_LOADING: {
      return assoc('fee', Remote.Loading, state)
    }
    case AT.FETCH_ETH_FEE_SUCCESS: {
      return assoc('fee', Remote.Success(payload), state)
    }
    case AT.FETCH_ETH_FEE_FAILURE: {
      return assoc('fee', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETH_LATEST_BLOCK_LOADING: {
      return state
    }
    case AT.FETCH_ETH_LATEST_BLOCK_SUCCESS: {
      return assoc('latest_block', Remote.Success(payload), state)
    }
    case AT.FETCH_ETH_LATEST_BLOCK_FAILURE: {
      return assoc('latest_block', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETH_LEGACY_BALANCE_LOADING: {
      return assoc('legacy_balance', Remote.Loading, state)
    }
    case AT.FETCH_ETH_LEGACY_BALANCE_SUCCESS: {
      const { balance } = payload
      return assoc('legacy_balance', Remote.Success(balance), state)
    }
    case AT.FETCH_ETH_LEGACY_BALANCE_FAILURE: {
      return assoc('legacy_balance', Remote.Failure(payload), state)
    }
    case AT.FETCH_ETH_CURRENT_BALANCE_LOADING: {
      return assocPath(['current_balance', 'eth'], Remote.Loading, state)
    }
    case AT.FETCH_ETH_CURRENT_BALANCE_SUCCESS: {
      const { balance } = payload
      return assocPath(['current_balance', 'eth'], Remote.Success(balance), state)
    }
    case AT.FETCH_ETH_CURRENT_BALANCE_FAILURE: {
      return assocPath(['current_balance', 'eth'], Remote.Failure(payload), state)
    }
    case AT.FETCH_ETH_RATES_LOADING: {
      return assocPath(['rates', 'eth'], Remote.Loading, state)
    }
    case AT.FETCH_ETH_RATES_SUCCESS: {
      return assocPath(['rates', 'eth'], Remote.Success(payload), state)
    }
    case AT.FETCH_ETH_RATES_FAILURE: {
      return assocPath(['rates', 'eth'], Remote.Failure(payload), state)
    }
    case AT.FETCH_ETH_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assocPath(['transactions', 'eth'], [Remote.Loading], state)
        : over(lensPath(['transactions', 'eth']), append(Remote.Loading), state)
    }
    case AT.FETCH_ETH_TRANSACTIONS_SUCCESS: {
      const { reset, transactions } = payload
      return reset
        ? assocPath(['transactions', 'eth'], [Remote.Success(transactions)], state)
        : over(
            lensPath(['transactions', 'eth']),
            // @ts-ignore
            compose(append(Remote.Success(transactions)), dropLast(1)),
            state
          )
    }
    case AT.FETCH_ETH_TRANSACTIONS_FAILURE: {
      return assocPath(['transactions', 'eth'], [Remote.Failure(payload)], state)
    }
    case AT.ETH_TRANSACTIONS_AT_BOUND: {
      return assocPath(['transactions_at_bound', 'eth'], payload, state)
    }
    case AT.FETCH_ETH_TRANSACTION_HISTORY_LOADING: {
      return assocPath(['transaction_history', 'eth'], Remote.Loading, state)
    }
    case AT.FETCH_ETH_TRANSACTION_HISTORY_SUCCESS: {
      return assocPath(['transaction_history', 'eth'], Remote.Success(payload), state)
    }
    case AT.FETCH_ETH_TRANSACTION_HISTORY_FAILURE: {
      return assocPath(['transaction_history', 'eth'], Remote.Failure(payload), state)
    }
    case AT.CLEAR_ETH_TRANSACTION_HISTORY: {
      return assocPath(['transaction_history', 'eth'], Remote.NotAsked, state)
    }
    case AT.CHECK_LOW_ETH_BALANCE_SUCCESS: {
      return assoc('warn_low_eth_balance', payload, state)
    }
    // ERC20
    case AT.FETCH_ERC20_TOKEN_DATA_LOADING: {
      const { token } = payload
      return assocPath(['info', token], Remote.Loading, state)
    }
    case AT.FETCH_ERC20_TOKEN_DATA_SUCCESS: {
      const { data, token } = payload
      return assocPath(['info', token], Remote.Success(data), state)
    }
    case AT.FETCH_ERC20_TOKEN_DATA_FAILURE: {
      const { error, token } = payload
      return assocPath(['info', token], Remote.Failure(error), state)
    }
    case AT.FETCH_ERC20_RATES_LOADING: {
      const { token } = payload
      return assocPath(['rates', token], Remote.Loading, state)
    }
    case AT.FETCH_ERC20_RATES_SUCCESS: {
      const { data, token } = payload
      return assocPath(['rates', token], Remote.Success(data), state)
    }
    case AT.FETCH_ERC20_RATES_FAILURE: {
      const { error, token } = payload
      return assocPath(['rates', token], Remote.Failure(error), state)
    }
    case AT.FETCH_ERC20_TOKEN_BALANCE_LOADING: {
      const { token } = payload
      return assocPath(['current_balance', token], Remote.Loading, state)
    }
    case AT.FETCH_ERC20_TOKEN_BALANCE_SUCCESS: {
      const { balance, token } = payload
      return assocPath(['current_balance', token], Remote.Success(balance), state)
    }
    case AT.FETCH_ERC20_TOKEN_BALANCE_FAILURE: {
      const { error, token } = payload
      return assocPath(['current_balance', token], Remote.Failure(error), state)
    }
    case AT.FETCH_ERC20_TOKEN_TRANSACTIONS_LOADING: {
      const { reset, token } = payload
      return reset
        ? assocPath(['transactions', token], [Remote.Loading], state)
        : over(lensPath(['transactions', token]), append(Remote.Loading), state)
    }
    case AT.FETCH_ERC20_TOKEN_TRANSACTIONS_SUCCESS: {
      const { reset, token, transactions } = payload
      return reset
        ? assocPath(['transactions', token], [Remote.Success(transactions)], state)
        : over(
            lensPath(['transactions', token]),
            // @ts-ignore
            compose(append(Remote.Success(transactions)), dropLast(1)),
            state
          )
    }
    case AT.FETCH_ERC20_TOKEN_TRANSACTIONS_FAILURE: {
      const { error, token } = payload
      return assocPath(['transactions', token], [Remote.Failure(error)], state)
    }
    case AT.FETCH_ERC20_TX_FEE_LOADING: {
      const { hash, token } = payload
      const txListLens = lensPath(['transactions', token, 0])
      const setData = (target) => (tx) => tx.hash === target ? { ...tx, fee: Remote.Loading } : tx

      // @ts-ignore
      return over(compose(txListLens, mapped, mapped), setData(hash), state)
    }
    case AT.FETCH_ERC20_TX_FEE_SUCCESS: {
      const { fee, hash, token } = payload
      const txListLens = lensPath(['transactions', token, 0])
      const setData = (target) => (tx) =>
        tx.hash === target ? { ...tx, fee: Remote.Success(fee) } : tx

      // @ts-ignore
      return over(compose(txListLens, mapped, mapped), setData(hash), state)
    }
    case AT.FETCH_ERC20_TX_FEE_FAILURE: {
      const { error, hash, token } = payload
      const txListLens = lensPath(['transactions', token, 0])
      const setData = (target) => (tx) =>
        tx.hash === target ? { ...tx, fee: Remote.Failure(error) } : tx

      // @ts-ignore
      return over(compose(txListLens, mapped, mapped), setData(hash), state)
    }
    case AT.ERC20_TOKEN_TX_AT_BOUND: {
      const { isAtBound, token } = payload
      return assocPath(['transactions_at_bound', token], isAtBound, state)
    }
    case AT.FETCH_ERC20_TRANSACTION_HISTORY_LOADING: {
      const { token } = payload
      return assocPath(['transaction_history', token], Remote.Loading, state)
    }
    case AT.FETCH_ERC20_TRANSACTION_HISTORY_SUCCESS: {
      const { token, txList } = payload
      return assocPath(['transaction_history', token], Remote.Success(txList), state)
    }
    case AT.FETCH_ERC20_TRANSACTION_HISTORY_FAILURE: {
      const { error, token } = payload
      return assocPath(['transaction_history', token], Remote.Failure(error), state)
    }
    case AT.CLEAR_ERC20_TRANSACTION_HISTORY: {
      const { token } = payload
      return assocPath(['transaction_history', token], Remote.NotAsked, state)
    }
    case AT.FETCH_ERC20_ACCOUNT_TOKEN_BALANCES_SUCCESS: {
      const { data } = payload
      return {
        ...state,
        erc20s: Remote.Success(data)
      }
    }
    default:
      return state
  }
}
