import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector([selectors.modules.profile.getUserData], (userDataR) => {
  return lift((userData: ExtractSuccess<typeof userDataR>) => ({
    userData
  }))(userDataR)
})

export default getData
