import { BSCoreActionTypes, CoinType } from '@core/types'

import * as AT from './actionTypes'

/* eslint-disable import/prefer-default-export */
export const setBSCoreCoinData = (
  coin: CoinType,
  next: string | null,
  pendingTxsN: number
): BSCoreActionTypes => ({
  payload: {
    coin,
    next,
    pendingTxsN
  },
  type: AT.SET_BS_CORE_COIN_DATA
})
