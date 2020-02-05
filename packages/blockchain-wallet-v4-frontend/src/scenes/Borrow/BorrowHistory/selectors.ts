import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const borrowHistoryR = selectors.components.borrow.getBorrowHistory(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  const transform = (borrowHistory, userData) => ({
    borrowHistory,
    userData
  })

  return lift(transform)(borrowHistoryR, userDataR)
}
