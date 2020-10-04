import moment from 'moment'

import {
  EthRawTxType,
  ExtractSuccess,
  InterestTransactionType,
  NonCustodialCoins,
  RawBtcTxType,
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
  const items: Array<RawBtcTxType | EthRawTxType> = []
  for (const value of NonCustodialCoins) {
    items.push(
      ...state.dataPath.activity.NON_CUSTODIAL[value].transactions.items
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

  console.log(statuses)

  return liftN(NonCustodialCoins.length, (...args) => args)(...statuses)
}

export const getAllActivity = (state: RootState) => {
  const custodialActivity = getCustodialActivity(state)
  const nonCustodialActivity = getNonCustodialActivity(state)

  const items = [...custodialActivity, ...nonCustodialActivity]

  // TODO clean this up
  return items.sort(
    (a, b) =>
      moment(
        'time' in b
          ? b.time * 1000
          : 'timestamp' in b
          ? b.timestamp
          : b.insertedAt
      ).valueOf() -
      moment(
        'time' in a
          ? a.time * 1000
          : 'timestamp' in a
          ? a.timestamp
          : a.insertedAt
      ).valueOf()
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
