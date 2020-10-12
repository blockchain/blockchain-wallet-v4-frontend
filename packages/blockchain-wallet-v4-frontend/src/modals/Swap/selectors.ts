import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [selectors.modules.profile.getUserData],
  userDataR => {
    return lift((userData: ExtractSuccess<typeof userDataR>) => ({
      userData
    }))(userDataR)
  }
)
