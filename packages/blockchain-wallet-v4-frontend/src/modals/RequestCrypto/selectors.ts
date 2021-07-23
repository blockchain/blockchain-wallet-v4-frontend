import { SupportedWalletCurrenciesType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state) => {
  const coins = selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)

  return Object.keys(coins).filter(
    (value) =>
      window.coins[value].coinfig.products.includes('PrivateKey') ||
      window.coins[value].coinfig.products.includes('SimpleBuyBalance')
  )
}

export default getData
