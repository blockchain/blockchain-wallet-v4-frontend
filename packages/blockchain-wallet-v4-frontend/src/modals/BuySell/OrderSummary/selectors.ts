import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.buySell.getBSCards(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)
  const interestAfterTransactionR = selectors.components.interest.getAfterTransaction(state)
  const recurringBuyListR = selectors.components.recurringBuy.getRegisteredList(state)
  const orderR = selectors.components.buySell.getBSOrder(state)

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>,
      interestAfterTransaction: ExtractSuccess<typeof interestAfterTransactionR>,
      recurringBuyList: ExtractSuccess<typeof recurringBuyListR>,
      order: ExtractSuccess<typeof orderR>
    ) => {
      return {
        cards,
        interestAfterTransaction,
        lockTime: withdrawLockCheck?.lockTime || 0,
        order,
        recurringBuyList,
        userData
      }
    }
  )(cardsR, userDataR, withdrawLockCheckR, interestAfterTransactionR, recurringBuyListR, orderR)
}
