import { lift, toLower } from 'ramda'

import { Remote } from 'blockchain-wallet-v4/src'
import { CoinType, SupportedWalletCurrenciesType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin }: { coin: CoinType } = ownProps
  const currencyR = selectors.core.settings.getCurrency(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const { coinfig } = window.coins[coin]
  let ratesR

  try {
    ratesR = coinfig.type.erc20Address
      ? selectors.core.data.eth.getErc20Rates(state, coin)
      : selectors.core.data[toLower(coin)].getRates(state)
  } catch (e) {
    ratesR = Remote.Failure('Unsupported Coin Code: Rates selector missing')
  }

  const transform = (currency, rates, supportedCoins: SupportedWalletCurrenciesType) => ({
    coinTicker: supportedCoins[coin].coinTicker,
    currency,
    rates,
    unit: coin
  })
  // @ts-ignore
  return lift(transform)(currencyR, ratesR, supportedCoinsR)
}

export default getData
