import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const borrowHistoryR = selectors.components.borrow.getBorrowHistory(state)
  const offersR = selectors.components.borrow.getOffers(state)
  const ratesR = selectors.components.borrow.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  const transform = (
    borrowHistory,
    offers,
    rates,
    supportedCoins,
    userData
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
