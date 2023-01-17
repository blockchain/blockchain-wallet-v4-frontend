import { createSelector } from '@reduxjs/toolkit'

import { CoinfigType } from '@core/redux/walletOptions/types'
import { selectors } from 'data'

const getCoinNetworkIfExistsOnMultiple = (
  coinfig: CoinfigType,
  coins: Coins,
  evmCompatibleCoinSymbols: string[]
) => {
  // Non-native asset
  if (coinfig?.type?.parentChain) {
    return coins[coinfig.type.parentChain].coinfig.name
  }

  // Native asset compatible with EVM
  if (evmCompatibleCoinSymbols.includes(coinfig.symbol)) {
    return coinfig.name
  }

  return null
}

/**
 * @returns View model for the warning for the coin if it exists on multiple networks. Otherwise, `null`.
 */
export const getCoinNetworkWarning = createSelector(
  [
    selectors.core.data.coins.getCoins,
    selectors.networkConfig.getEvmCompatibleCoins,
    (_, coin) => coin
  ],
  (coins, evmCompatibleCoinSymbols, coin: string) => {
    const { coinfig } = coins[coin]
    const maybeNetwork = getCoinNetworkIfExistsOnMultiple(coinfig, coins, evmCompatibleCoinSymbols)

    if (maybeNetwork) {
      return {
        network: maybeNetwork,
        symbol: coinfig.displaySymbol
      }
    }

    return null
  }
)
