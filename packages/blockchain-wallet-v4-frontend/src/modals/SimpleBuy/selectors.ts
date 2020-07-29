import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const userDataR = selectors.modules.profile.getUserData(state)
  return lift((userData: ExtractSuccess<typeof userDataR>) => ({
    userData
  }))(userDataR)
}
