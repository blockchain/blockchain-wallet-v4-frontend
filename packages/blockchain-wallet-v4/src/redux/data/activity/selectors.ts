import moment from 'moment'

import {
  CoinType,
  ExtractSuccess,
  InterestTransactionType,
  NabuCustodialProductType,
  NonCustodialCoins,
  ProcessedTxType,
  RemoteDataType,
  SBOrderType,
  SBTransactionType
} from 'blockchain-wallet-v4/src/types'

import { lift, liftN } from 'ramda'

import { NabuProducts, NabuTxType, SUCCESS_STATUS } from './types'
import { RootState } from 'data/rootReducer'

export const getActivity = (state: RootState) => state.dataPath.activity

export const getCustodialActivity = (state: RootState) => {
  const items: Array<
    SBTransactionType | InterestTransactionType | SBOrderType
  > = []
  for (const value of NabuProducts) {
    for (const type of NabuTxType) {
      items.push(...state.dataPath.activity[value][type].items)
    }
  }

  return items
}

export const getCustodialActivityStatus = (
  state: RootState
): RemoteDataType<string, typeof SUCCESS_STATUS> => {
  const statuses: Array<RemoteDataType<string, typeof SUCCESS_STATUS>> = []
  for (const product of NabuProducts) {
    for (const type of NabuTxType) {
      statuses.push(state.dataPath.activity[product][type].status)
    }
  }

  return liftN(
    NabuProducts.length * NabuTxType.length,
    (...args) => args
  )(...statuses)
}

export const getNonCustodialActivity = (state: RootState) => {
  const items: Array<ProcessedTxType> = []
  for (const coin of NonCustodialCoins) {
    items.push(
      ...state.dataPath.activity.NON_CUSTODIAL[coin].transactions.items
    )
  }

  return items
}

export const getNonCustodialActivityStatus = (
  state: RootState
): RemoteDataType<string, typeof SUCCESS_STATUS> => {
  const statuses: Array<RemoteDataType<string, typeof SUCCESS_STATUS>> = []
  for (const coin of NonCustodialCoins) {
    statuses.push(
      state.dataPath.activity.NON_CUSTODIAL[coin].transactions.status
    )
  }

  return liftN(NonCustodialCoins.length, (...args) => args)(...statuses)
}

export const getAllActivity = (state: RootState) => {
  const custodialActivity = getCustodialActivity(state)
  const nonCustodialActivity = getNonCustodialActivity(state)

  const items = [...custodialActivity, ...nonCustodialActivity]

  return items.sort(
    (a, b) => moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
  )
}

export const getAllActivityStatus = (state: RootState) => {
  const custodialActivityStatus = getCustodialActivityStatus(state)
  const nonCustodialActivityStatus = getNonCustodialActivityStatus(state)

  return lift(
    (
      a: ExtractSuccess<typeof custodialActivityStatus>,
      b: ExtractSuccess<typeof nonCustodialActivityStatus>
    ) => [...a, ...b]
  )(custodialActivityStatus, nonCustodialActivityStatus)
}

export const getNextNonCustodialActivity = (
  coin: CoinType,
  state: RootState
) => {
  const nextUrl = state.dataPath.activity.NON_CUSTODIAL[coin].transactions.next
  const offset = nextUrl
    ? Number(new URLSearchParams(nextUrl).get('offset')) ||
      Number(new URLSearchParams(nextUrl).get('page'))
    : 0
  return {
    nextUrl,
    offset
  }
}

export const getNextCustodialActivity = (
  product: NabuCustodialProductType,
  state: RootState
) => {
  return state.dataPath.activity[product].transactions.next
}

export const getNextActivity = (state: RootState) => {
  const nexts: Array<string | null | undefined> = []
  for (const coin of NonCustodialCoins) {
    nexts.push(getNextNonCustodialActivity(coin, state).nextUrl)
  }
  for (const product of NabuProducts) {
    nexts.push(getNextCustodialActivity(product, state))
  }

  return nexts.filter(value => !!value)
}
