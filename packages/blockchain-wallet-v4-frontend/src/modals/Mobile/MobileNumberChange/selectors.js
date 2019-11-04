import { formValueSelector } from 'redux-form'
import { lift } from 'ramda'
import PhoneNumber from 'awesome-phonenumber'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

const getCountryCode = (defaultCode, currentNumber) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

const formSelector = formValueSelector('mobileNumberChange')

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getSmsNumber,
    selectors.core.settings.getCountryCode,
    state => formSelector(state, 'mobileNumber')
  ],
  (currentNumber, defaultCode, smsNumberNew) => ({
    smsNumberNew,
    countryCode: lift(getCountryCode)(defaultCode, currentNumber),
    smsNumber: currentNumber.getOrElse('')
  })
)
