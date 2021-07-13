import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector([selectors.modules.profile.getUserData], (userDataR) => {
  return lift((userData: ExtractSuccess<typeof userDataR>) => ({
    userData
  }))(userDataR)
})

export default getData
