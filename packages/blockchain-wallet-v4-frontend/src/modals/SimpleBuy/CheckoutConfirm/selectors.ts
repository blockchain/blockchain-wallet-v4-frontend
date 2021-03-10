import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )

  const quoteR = selectors.components.simpleBuy.getSBQuote(state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(
    state
  )
  const sddEligibleR = selectors.components.simpleBuy.getSddEligible(state)
  const userSDDTierR = selectors.components.simpleBuy.getUserSddEligibleTier(
    state
  )
  const isUserSddVerifiedR = selectors.components.simpleBuy.isUserSddVerified(
    state
  )
  const cardsR = selectors.components.simpleBuy.getSBCards(state)

  return lift(
    (
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
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
      quote,
      sbBalances,
      userData,
      withdrawLockCheck,
      isSddFlow: sddEligible.eligible || userSDDTier === 3,
      isUserSddVerified,
      cards
    })
  )(
    bankAccountsR,
    quoteR,
    sbBalancesR,
    userDataR,
    withdrawLockCheckR,
    sddEligibleR,
    userSDDTierR,
    isUserSddVerifiedR,
    cardsR
  )
}
