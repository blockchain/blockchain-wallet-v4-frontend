import PhoneNumber from 'awesome-phonenumber'
import { lift } from 'ramda'

import { formValueSelector } from 'redux-form'
import { selectors } from 'data'

const getCountryCode = (defaultCode, currentNumber) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

export const getData = (state) => {
  const currentNumber = selectors.core.settings.getSmsNumber(state)
  const defaultCode = selectors.core.settings.getCountryCode(state)
  return {
    mobileNumber: formValueSelector('mobileNumberChange')(state, 'mobileNumber'),
    countryCode: lift(getCountryCode)(defaultCode, currentNumber)
  }
}
