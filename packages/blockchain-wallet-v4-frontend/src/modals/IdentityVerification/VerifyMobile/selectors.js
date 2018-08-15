import PhoneNumber from 'awesome-phonenumber'
import { path, lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => ({
  smsNumber: selectors.core.settings.getSmsNumber(state).getOrElse(''),
  step: selectors.components.identityVerification
    .getSmsStep(state)
    .getOrElse(null),
  mobileVerifiedError: path(['securityCenter', 'mobileVerifiedError'], state),
  countryCode: getCountryCode(state)
})

const determineCountryCode = (currentNumber, defaultCode) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

const getCountryCode = state =>
  lift(determineCountryCode)(
    selectors.core.settings.getSmsNumber(state),
    selectors.core.settings.getCountryCode(state)
  )
