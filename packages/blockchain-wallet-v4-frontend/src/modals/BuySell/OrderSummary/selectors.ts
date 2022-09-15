import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const interestEligibleR = selectors.components.interest.getInterestEligible(state)
  const interestRatesR = selectors.components.interest.getInterestRates(state)
  const cardsR = selectors.components.buySell.getBSCards(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)
  const recurringBuyListR = selectors.components.recurringBuy.getRegisteredList(state)
  const orderR = selectors.components.buySell.getBSOrder(state)

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>,
      recurringBuyList: ExtractSuccess<typeof recurringBuyListR>,
      order: ExtractSuccess<typeof orderR>,
      interestRates: ExtractSuccess<typeof interestRatesR>,
      interestEligible: ExtractSuccess<typeof interestEligibleR>
    ) => {
      return {
        cards,
        interestEligible,
        interestRates,
        lockTime: withdrawLockCheck?.lockTime || 0,
        order,
        recurringBuyList,
        userData
      }
    }
  )(
    cardsR,
    userDataR,
    withdrawLockCheckR,
    recurringBuyListR,
    orderR,
    interestRatesR,
    interestEligibleR
  )
}
