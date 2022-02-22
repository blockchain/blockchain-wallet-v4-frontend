import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const countryCode = selectors.core.settings.getCountryCode(state).getOrElse(null)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((userData: ExtractSuccess<typeof userDataR>) => ({
    countryCode,
    userData
  }))(userDataR)
}
