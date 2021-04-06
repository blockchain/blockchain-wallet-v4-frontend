import { append, assoc, compose, dropLast, lensProp, over } from 'ramda'

import Remote from 'blockchain-wallet-v4/src/remote/remote'

import * as AT from './actionTypes'
import { InterestActionTypes, InterestState } from './types'

const INITIAL_STATE: InterestState = {
  account: Remote.NotAsked,
  accountBalance: Remote.NotAsked,
  afterTransaction: Remote.NotAsked,
  coin: 'BTC',
  depositLimits: {
    maxFiat: 0,
    minFiat: 0,
    maxCoin: 0,
    minCoin: 0
  },
  interestEligible: Remote.NotAsked,
  instruments: Remote.NotAsked,
  interestLimits: Remote.NotAsked,
  interestRate: Remote.NotAsked,
  isCoinDisplayed: false,
  isFromBuySell: false,
  payment: Remote.NotAsked,
  step: {
    data: {},
    name: 'ACCOUNT_SUMMARY'
  },
  transactions: [],
  transactionsNextPage: null,
  withdrawalMinimums: Remote.NotAsked
}

export function interestReducer(
  state = INITIAL_STATE,
  action: InterestActionTypes
): InterestState {
  // @ts-ignore
  const { payload, type } = action
  switch (type) {
    case AT.FETCH_INTEREST_BALANCE_FAILURE:
      return {
        ...state,
        accountBalance: Remote.Failure(payload.error)
      }
    case AT.FETCH_INTEREST_BALANCE_LOADING:
      return {
        ...state,
        accountBalance: Remote.Loading
      }
    case AT.FETCH_INTEREST_BALANCE_SUCCESS:
      return {
        ...state,
        accountBalance: Remote.Success(payload.interestAccountBalance)
      }
    case AT.FETCH_INTEREST_ELIGIBLE_FAILURE:
      return {
        ...state,
        interestEligible: Remote.Failure(payload.error)
      }
    case AT.FETCH_INTEREST_ELIGIBLE_LOADING:
      return {
        ...state,
        interestEligible: Remote.Loading
      }
    case AT.FETCH_INTEREST_ELIGIBLE_SUCCESS:
      return {
        ...state,
        interestEligible: Remote.Success(payload.interestEligible)
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_FAILURE:
      return {
        ...state,
        instruments: Remote.Failure(payload.error)
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_LOADING:
      return {
        ...state,
        instruments: Remote.Loading
      }
    case AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS:
      return {
        ...state,
        instruments: Remote.Success(payload.interestInstruments.instruments)
      }
    case AT.FETCH_INTEREST_LIMITS_FAILURE:
      return {
        ...state,
        interestLimits: Remote.Failure(payload.error)
      }
    case AT.FETCH_INTEREST_LIMITS_LOADING:
      return {
        ...state,
        interestLimits: Remote.Loading
      }
    case AT.FETCH_INTEREST_LIMITS_SUCCESS:
      return {
        ...state,
        interestLimits: Remote.Success(payload.interestLimits)
      }
    case AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE:
      return {
        ...state,
        account: Remote.Failure(payload.error)
      }
    case AT.FETCH_INTEREST_PAYMENT_ACCOUNT_LOADING:
      return {
        ...state,
        account: Remote.Loading
      }
    case AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS:
      return {
        ...state,
        account: Remote.Success(payload.account)
      }
    case AT.FETCH_INTEREST_RATE_FAILURE:
      return {
        ...state,
        interestRate: Remote.Failure(payload.error)
      }
    case AT.FETCH_INTEREST_RATE_LOADING:
      return {
        ...state,
        interestRate: Remote.Loading
      }
    case AT.FETCH_INTEREST_RATE_SUCCESS:
      return {
        ...state,
        interestRate: Remote.Success(payload.interestRate.rates)
      }
    case AT.FETCH_INTEREST_TRANSACTIONS_LOADING: {
      const { reset } = payload
      return reset
        ? assoc('transactions', [Remote.Loading], state)
        : over(lensProp('transactions'), append(Remote.Loading), state)
    }
    case AT.FETCH_INTEREST_TRANSACTIONS_FAILURE: {
      return assoc('transactions', [Remote.Failure(payload)], state)
    }
    case AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS: {
      const { reset, transactions } = payload
      return reset
        ? assoc('transactions', [Remote.Success(transactions)], state)
        : over(
            lensProp('transactions'),
            compose(
              // @ts-ignore
              append(Remote.Success(transactions)),
              dropLast(1)
            ),
            state
          )
    }
    case AT.SET_TRANSACTIONS_NEXT_PAGE:
      return {
        ...state,
        transactionsNextPage: payload.nextPage
      }
    case AT.INITIALIZE_DEPOSIT_FORM: {
      return {
        ...state,
        coin: payload.coin
      }
    }
    case AT.SET_INTEREST_DEPOSIT_LIMITS: {
      return {
        ...state,
        depositLimits: payload.limits
      }
    }
    case AT.SET_INTEREST_STEP: {
      const { data, name } = payload
      return {
        ...state,
        step: {
          data: data || {},
          name
        }
      }
    }

    case AT.SET_COIN_DISPLAY: {
      return {
        ...state,
        isCoinDisplayed: payload.isCoinDisplayed
      }
    }

    case AT.SET_PAYMENT_FAILURE:
      return {
        ...state,
        payment: Remote.Failure(payload.error)
      }
    case AT.SET_PAYMENT_LOADING:
      return {
        ...state,
        payment: Remote.Loading
      }
    case AT.SET_PAYMENT_SUCCESS:
      return {
        ...state,
        payment: Remote.Success(payload.payment)
      }
    case AT.SET_WITHDRAWAL_MINIMUMS_FAILURE: {
      return {
        ...state,
        withdrawalMinimums: Remote.Failure(payload.error)
      }
    }
    case AT.SET_WITHDRAWAL_MINIMUMS_LOADING: {
      return {
        ...state,
        withdrawalMinimums: Remote.Loading
      }
    }
    case AT.SET_WITHDRAWAL_MINIMUMS_SUCCESS:
      return {
        ...state,
        withdrawalMinimums: Remote.Success(
          payload.withdrawalMinimums.minAmounts
        )
      }
    case AT.SHOW_INTEREST_MODAL:
      return {
        ...state,
        coin: payload.coin,
        isFromBuySell: payload.isFromBuySell
      }
    case AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_FAILURE:
      return {
        ...state,
        afterTransaction: Remote.Failure(payload.error)
      }
    case AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_LOADING:
      return {
        ...state,
        afterTransaction: Remote.Loading
      }
    case AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_SUCCESS:
      return {
        ...state,
        afterTransaction: Remote.Success(payload.afterTransaction)
      }
    case AT.RESET_SHOW_INTEREST_CARD_AFTER_TRANSACTION:
      return {
        ...state,
        afterTransaction: Remote.NotAsked
      }
    default:
      return state
  }
}
