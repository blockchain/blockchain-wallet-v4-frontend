import { createDeepEqualSelector } from 'services/ReselectHelper'
import { path } from 'ramda'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.components.priceChart.getCoin,
    selectors.core.settings.getInvitations,
    selectors.core.kvStore.buySell.getCoinifyUser,
    selectors.core.walletOptions.getSupportedCoins,
    selectors.modules.profile.isSilverOrAbove
  ],
  (
    coinTicker,
    invitationsR,
    isCoinifyUser,
    supportedCoins,
    isSilverOrAbove
  ) => {
    const cryptoCurrency = path(
      ['data', coinTicker, 'coinCode'],
      supportedCoins
    )
    const coinName = path(['data', coinTicker, 'displayName'], supportedCoins)
    const invitations = invitationsR.getOrElse({ simpleBuy: false })

    return {
      cryptoCurrency,
      coinTicker,
      coinName,
      invitations,
      isCoinifyUser,
      isSilverOrAbove
    }
  }
)
