import PhoneNumber from 'awesome-phonenumber'
import { selectors } from 'data'
import { path, lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = state => ({
  personalData: selectors.components.identityVerification.getPersonalData(
    state
  ),
  step: selectors.components.identityVerification
    .getPersonalStep(state)
    .getOrElse(null),
  countryCode: getCountryCode(state)
})

export const getEmailData = state => ({
  step: selectors.components.identityVerification
    .getEmailStep(state)
    .getOrElse(null),
  emailVerifiedError: path(['securityCenter', 'emailVerifiedError'], state)
})

export const getSmsData = state => ({
  step: selectors.components.identityVerification
    .getSmsStep(state)
    .getOrElse(null),
  mobileVerifiedError: path(['securityCenter', 'mobileVerifiedError'], state),
  countryCode: getCountryCode(state)
})

const determineCountryCode = (defaultCode, currentNumber) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

const getCountryCode = createDeepEqualSelector(
  [
    selectors.core.settings.getSmsNumber,
    selectors.core.settings.getCountryCode
  ],
  lift(determineCountryCode)
)
