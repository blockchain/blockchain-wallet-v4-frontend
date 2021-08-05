import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(state)
  const afterTransactionR = selectors.components.interest.getAfterTransaction(state)
  const recurringBuyListR = selectors.components.recurringBuy.getRegisteredList(state)

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>,
      recurringBuyList: ExtractSuccess<typeof recurringBuyListR>
    ) => {
      return {
        afterTransaction,
        cards,
        recurringBuyList,
        userData,
        withdrawLockCheck
      }
    }
  )(cardsR, userDataR, withdrawLockCheckR, afterTransactionR, recurringBuyListR)
}
