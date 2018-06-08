import PhoneNumber from 'awesome-phonenumber'
import { lift } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const getCountryCode = (defaultCode, currentNumber) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

export const getData = (state) => createDeepEqualSelector(
  [
    selectors.core.settings.getAuthType,
    selectors.core.settings.getSmsNumber,
    selectors.core.settings.getSmsVerified,
    selectors.core.settings.getSmsNumber,
    selectors.core.settings.getCountryCode
  ],
  (authTypeR, smsNumberR, smsVerifiedR, currentNumber, defaultCode) => {
    const transform = (authType, smsNumber, smsVerified) => {
      return {
        countryCode: lift(getCountryCode)(defaultCode, currentNumber),
        authType: parseInt(authType),
        smsVerified,
        smsNumber
      }
    }
    return lift(transform)(authTypeR, smsNumberR, smsVerifiedR)
  }
)(state)
