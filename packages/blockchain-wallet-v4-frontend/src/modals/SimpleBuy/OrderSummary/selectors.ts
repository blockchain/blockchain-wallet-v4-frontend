import { lift } from 'ramda'

import { ExtractSuccess } from 'core/types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(
    state
  )
  const afterTransactionR = selectors.components.interest.getAfterTransaction(
    state
  )

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      userData: ExtractSuccess<typeof userDataR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>,
      afterTransaction: ExtractSuccess<typeof afterTransactionR>
    ) => ({
      cards,
      userData,
      withdrawLockCheck,
      afterTransaction
    })
  )(cardsR, userDataR, withdrawLockCheckR, afterTransactionR)
}
