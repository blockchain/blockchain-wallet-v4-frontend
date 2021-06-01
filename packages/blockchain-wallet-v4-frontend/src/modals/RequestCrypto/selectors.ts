import { SupportedWalletCurrenciesType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = (state) => {
  const supportedCoins = selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)

  return Object.keys(supportedCoins).filter((value) =>
    window.coins[value].coinfig.products.includes('PrivateKey')
  )
}

export default getData
