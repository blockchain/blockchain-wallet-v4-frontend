import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)

  const quoteR = selectors.components.buySell.getBSQuote(state)
  const buyQuoteR = selectors.components.buySell.getBuyQuote(state)
  const sbBalancesR = selectors.components.buySell.getBSBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)
  const sddEligibleR = selectors.components.buySell.getSddEligible(state)
  const userSDDTierR = selectors.components.buySell.getUserSddEligibleTier(state)
  const isUserSddVerifiedR = selectors.components.buySell.isUserSddVerified(state)
  const cardsR = selectors.components.buySell.getBSCards(state)

  return lift(
    (
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
      buyQuote: ExtractSuccess<typeof buyQuoteR>,
      quote: ExtractSuccess<typeof quoteR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>,
      sddEligible: ExtractSuccess<typeof sddEligibleR>,
      userSDDTier: ExtractSuccess<typeof userSDDTierR>,
      isUserSddVerified: ExtractSuccess<typeof isUserSddVerifiedR>,
      cards: ExtractSuccess<typeof cardsR>
    ) => ({
      bankAccounts,
      buyQuote,
      cards,
      isSddFlow: sddEligible.eligible || userSDDTier === 3,
      isUserSddVerified,
      quote,
      sbBalances,
      userData,
      withdrawLockCheck
    })
  )(
    bankAccountsR,
    quoteR,
    buyQuoteR,
    sbBalancesR,
    userDataR,
    withdrawLockCheckR,
    sddEligibleR,
    userSDDTierR,
    isUserSddVerifiedR,
    cardsR
  )
}
