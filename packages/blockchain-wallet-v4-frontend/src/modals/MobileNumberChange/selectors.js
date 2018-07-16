import PhoneNumber from 'awesome-phonenumber'
import { lift } from 'ramda'
import { formValueSelector } from 'redux-form'

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
    smsNumberNew: formValueSelector('mobileNumberChange')(state, 'mobileNumber'),
    countryCode: lift(getCountryCode)(defaultCode, currentNumber),
    smsNumber: currentNumber.getOrElse('')
  })
)(state)
