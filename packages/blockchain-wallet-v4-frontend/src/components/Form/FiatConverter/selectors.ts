import { includes, lift, toLower } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import {
  CoinType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin }: { coin: CoinType } = ownProps
  const currencyR = selectors.core.settings.getCurrency(state)
  const erc20List = selectors.core.walletOptions
    .getErc20CoinList(state)
    .getOrElse([])
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  let ratesR

  try {
    // @ts-ignore
    ratesR = includes(coin, erc20List)
      ? selectors.core.data.eth.getErc20Rates(state, toLower(coin))
      : selectors.core.data[toLower(coin)].getRates(state)
  } catch (e) {
    ratesR = Remote.Failure('Unsupported Coin Code: Rates selector missing')
  }

  const transform = (
    currency,
    rates,
    supportedCoins: SupportedWalletCurrenciesType
  ) => ({
    unit: coin,
    coinTicker: supportedCoins[coin].coinTicker,
    currency,
    rates
  })
  // @ts-ignore
  return lift(transform)(currencyR, ratesR, supportedCoinsR)
}
