import PhoneNumber from 'awesome-phonenumber'
import { lift } from 'ramda'

import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const getCountryCode = (defaultCode, currentNumber) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

export const getData = (state) => createDeepEqualSelector(
  [
    selectors.core.settings.getSmsNumber,
    selectors.core.settings.getCountryCode
  ],
  (currentNumber, defaultCode) => ({
    countryCode: lift(getCountryCode)(defaultCode, currentNumber)
  })
)(state)
