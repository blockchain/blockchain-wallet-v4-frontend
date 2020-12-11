import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
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

  return lift(
    (
      quote: ExtractSuccess<typeof quoteR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>,
      sddEligible: ExtractSuccess<typeof sddEligibleR>,
      userSDDTier: ExtractSuccess<typeof userSDDTierR>,
      isUserSddVerified: ExtractSuccess<typeof isUserSddVerifiedR>
    ) => ({
      quote,
      sbBalances,
      userData,
      withdrawLockCheck,
      isSddFlow: sddEligible.eligible || userSDDTier === 3,
      isUserSddVerified
    })
  )(
    quoteR,
    sbBalancesR,
    userDataR,
    withdrawLockCheckR,
    sddEligibleR,
    userSDDTierR,
    isUserSddVerifiedR
  )
}
