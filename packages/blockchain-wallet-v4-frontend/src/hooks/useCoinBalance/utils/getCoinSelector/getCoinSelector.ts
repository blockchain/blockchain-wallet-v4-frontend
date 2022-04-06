import { RemoteDataType } from '@core/types'
import {
  getBchBalance,
  getBtcBalance,
  getCoinCustodialBalance,
  getErc20Balance,
  getEthBalance,
  getFiatBalance,
  getXlmBalance
} from 'components/Balances/selectors'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

type Selector = (state: RootState) => RemoteDataType<any, number>
type Coins = 'EUR' | 'GBP' | 'USD' | 'BTC' | 'BCH' | 'ETH' | 'XLM'

export const getCoinSelector = (coin: string): Selector => {
  const mapCoinToSelector: Record<Coins, Selector> = {
    BCH: getBchBalance,
    BTC: getBtcBalance,
    ETH: getEthBalance,
    EUR: (state) => getFiatBalance('EUR', state),
    GBP: (state) => getFiatBalance('GBP', state),
    USD: (state) => getFiatBalance('USD', state),
    XLM: getXlmBalance
  }

  if (mapCoinToSelector[coin]) {
    return mapCoinToSelector[coin]
  }

  const isErc = selectors.core.data.coins.getErc20Coins().includes(coin)
  const isCustodial = selectors.core.data.coins.getCustodialCoins().includes(coin)

  if (isErc) {
    return getErc20Balance(coin)
  }

  if (isCustodial) {
    return getCoinCustodialBalance(coin)
  }

  throw Error(`Selector not defined for coin "${coin}"`)
}
