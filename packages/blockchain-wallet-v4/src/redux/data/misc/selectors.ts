import * as selectors from '../../selectors'
import { CoinType, RemoteDataType } from 'core/types'
import { dataPath } from '../../paths'
import { INVALID_COIN_TYPE } from 'blockchain-wallet-v4/src/model'
import { path } from 'ramda'
import { RatesType } from 'data/types'
import { Remote } from 'blockchain-wallet-v4/src'

export const getCaptcha = path([dataPath, 'misc', 'captcha'])

export const getPriceIndexSeries = path([
  dataPath,
  'misc',
  'price_index_series'
])

export const getLogs = path([dataPath, 'misc', 'logs'])

export const getPairingCode = path([dataPath, 'misc', 'pairing_code'])

export const authorizeLogin = path([dataPath, 'misc', 'authorize_login'])

export const handle2FAReset = path([dataPath, 'misc', 'handle_2fa_reset'])

export const verifyEmailToken = path([dataPath, 'misc', 'verify_email_token'])

export const getRatesSelector = (
  coin: CoinType,
  state
): RemoteDataType<string, RatesType> => {
  switch (coin) {
    case 'BTC':
      return selectors.data.btc.getRates(state)
    case 'BCH':
      return selectors.data.bch.getRates(state)
    case 'ETH':
      return selectors.data.eth.getRates(state)
    case 'XLM':
      return selectors.data.xlm.getRates(state)
    case 'ALGO':
      return selectors.data.xlm.getRates(state)
    case 'PAX':
      return selectors.data.eth.getErc20Rates(state, 'pax')
    default:
      return Remote.Failure(INVALID_COIN_TYPE)
  }
}
