import { RemoteDataType } from 'core/types'

import Remote from '../../../remote'
import * as AT from './actionTypes'
import {
  FiatActionTypes,
  FiatStateType,
  FiatTransactionPageResponseType
} from './types'

const DEFAULT_STATE = {
  page: [],
  nextSbTxId: Remote.NotAsked,
  nextSbTxTimestamp: Remote.NotAsked,
  nextSwapPageTimestamp: Remote.NotAsked
}

const INITIAL_STATE: FiatStateType = {
  EUR: DEFAULT_STATE,
  GBP: DEFAULT_STATE,
  USD: DEFAULT_STATE
}

let txs: Array<RemoteDataType<string, FiatTransactionPageResponseType['page']>>

export const fiatReducer = (
  state = INITIAL_STATE,
  action: FiatActionTypes
): FiatStateType => {
  switch (action.type) {
    case AT.FETCH_FIAT_TRANSACTIONS_FAILURE:
      return {
        ...state,
        [action.payload.currency]: {
          page: [Remote.Failure(action.payload.error)],
          nextSbTxId: Remote.Failure(action.payload.error),
          nextSbTxTimestamp: Remote.Failure(action.payload.error),
          nextSwapPageTimestamp: Remote.Failure(action.payload.error)
        }
      }
    case AT.FETCH_FIAT_TRANSACTIONS_LOADING:
      txs = state[action.payload.currency]?.page || []
      return {
        ...state,
        [action.payload.currency]: {
          page: action.payload.reset
            ? [Remote.Loading]
            : txs
            ? [...txs, Remote.Loading]
            : [Remote.Loading],
          nextSbTxId: Remote.Loading,
          nextSbTxTimestamp: Remote.Loading,
          nextSwapPageTimestamp: Remote.Loading
        }
      }
    case AT.FETCH_FIAT_TRANSACTIONS_SUCCESS:
      txs = state[action.payload.currency]?.page || []
      return {
        ...state,
        [action.payload.currency]: {
          page: [
            ...txs.filter((tx, i) => i !== txs.length - 1),
            Remote.Success(action.payload.response.page)
          ],
          nextSbTxId: Remote.Success(action.payload.response.nextSbTxId),
          nextSbTxTimestamp: Remote.Success(
            action.payload.response.nextSbTxTimestamp
          ),
          nextSwapPageTimestamp: Remote.Success(
            action.payload.response.nextSwapPageTimestamp
          )
        }
      }
    default: {
      return state
    }
  }
}

export default fiatReducer
