import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const withdrawLockCheckR = selectors.components.send.getWithdrawLockCheckRule(
    state
  )

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      withdrawLockCheck: ExtractSuccess<typeof withdrawLockCheckR>
    ) => ({
      cards,
      withdrawLockCheck
    })
  )(cardsR, withdrawLockCheckR)
}
