import { lift } from 'ramda'

import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

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
        smsNumber,
        smsVerified
      }
    }
    return lift(transform)(authTypeR, smsNumberR, smsVerifiedR)
  }
)
