import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((userData: ExtractSuccess<typeof userDataR>) => ({
    userData
  }))(userDataR)
}

export default getData
