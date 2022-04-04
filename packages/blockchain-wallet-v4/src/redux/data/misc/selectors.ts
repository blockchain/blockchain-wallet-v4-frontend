import { Remote } from '@core'
import {
  CoinType,
  PriceChangeType,
  RatesType,
  RemoteDataType,
  TimeRange,
  WalletCurrencyType
} from '@core/types'
import { RootState } from 'data/rootReducer'

import * as selectors from '../../selectors'

export const getPriceIndexSeries = (state: RootState) => state.dataPath.misc.price_index_series

export const getPairingCode = (state: RootState) => state.dataPath.misc.pairing_code

export const authorizeLogin = (state: RootState) => state.dataPath.misc.authorize_login

export const handle2FAReset = (state: RootState) => state.dataPath.misc.handle_2fa_reset

export const verifyEmailToken = (state: RootState) => state.dataPath.misc.verify_email_token

export const getPriceChange = (
  coin: CoinType,
  range: TimeRange,
  state: RootState
): RemoteDataType<string, PriceChangeType> | undefined =>
  state.dataPath.misc.price_change[range][coin] || Remote.NotAsked

export const getRatesSelector = (
  coin: WalletCurrencyType,
  state
): RemoteDataType<string, RatesType> => {
  return selectors.data.coins.getRates(coin, state)
}
