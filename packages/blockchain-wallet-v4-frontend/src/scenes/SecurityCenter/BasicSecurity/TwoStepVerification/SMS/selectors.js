import { lift } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/misc'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getAuthType,
    selectors.core.settings.getSmsNumber,
    selectors.core.settings.getSmsVerified
  ],
  (authTypeR, smsNumberR, smsVerifiedR) => {
    const transform = (authType, smsNumber, smsVerified) => {
      return {
        authType: parseInt(authType),
        smsVerified,
        smsNumber
      }
    }
    return lift(transform)(authTypeR, smsNumberR, smsVerifiedR)
  }
)
