import { lift } from 'ramda'

import {
  ExtractSuccess,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const borrowHistoryR = selectors.components.borrow.getBorrowHistory(state)
  const offersR = selectors.components.borrow.getOffers(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  const transform = (
    borrowHistory: ExtractSuccess<typeof borrowHistoryR>,
    offers: ExtractSuccess<typeof offersR>,
    rates: ExtractSuccess<typeof ratesR>,
    supportedCoins: SupportedWalletCurrenciesType,
    userData: ExtractSuccess<typeof userDataR>
  ) => ({
    borrowHistory,
    offers,
    rates,
    supportedCoins,
    userData
  })

  return lift(transform)(
    borrowHistoryR,
    offersR,
    ratesR,
    supportedCoinsR,
    userDataR
  )
}
