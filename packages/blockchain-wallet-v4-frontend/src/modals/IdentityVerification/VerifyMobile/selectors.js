import PhoneNumber from 'awesome-phonenumber'
import { path, lift } from 'ramda'
import { selectors, model } from 'data'

const { SMS_NUMBER_FORM } = model.components.identityVerification
const activeFieldSelector = selectors.form.getActiveField(SMS_NUMBER_FORM)

export const getData = state => ({
  smsNumber: selectors.core.settings.getSmsNumber(state).getOrElse(''),
  step: selectors.components.identityVerification
    .getSmsStep(state)
    .getOrElse(null),
  mobileVerifiedError: path(['securityCenter', 'mobileVerifiedError'], state),
  countryCode: getCountryCode(state),
  activeField: activeFieldSelector(state)
})

const determineCountryCode = (currentNumber, defaultCode) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

const getCountryCode = state =>
  lift(determineCountryCode)(
    selectors.core.settings.getSmsNumber(state),
    selectors.core.settings.getCountryCode(state)
  )
