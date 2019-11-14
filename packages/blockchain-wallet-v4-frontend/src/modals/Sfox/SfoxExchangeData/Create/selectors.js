import { lift } from 'ramda'
import PhoneNumber from 'awesome-phonenumber'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

const getCountryCode = (defaultCode, currentNumber) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getSmsNumber,
    selectors.core.settings.getCountryCode
  ],
  (currentNumber, defaultCode) => ({
    countryCode: lift(getCountryCode)(defaultCode, currentNumber)
  })
)
