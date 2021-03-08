import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'

export const getData = createDeepEqualSelector(
  [selectors.modules.profile.getUserData],
  userDataR => {
    return lift((userData: ExtractSuccess<typeof userDataR>) => ({
      userData
    }))(userDataR)
  }
)
