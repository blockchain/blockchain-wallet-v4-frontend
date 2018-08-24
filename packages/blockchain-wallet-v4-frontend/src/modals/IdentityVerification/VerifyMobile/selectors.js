import PhoneNumber from 'awesome-phonenumber'
import { prop, lift } from 'ramda'
import { selectors, model } from 'data'

const { SMS_NUMBER_FORM } = model.components.identityVerification
const activeFieldSelector = selectors.form.getActiveField(SMS_NUMBER_FORM)
const submitErrorsSelector = selectors.form.getFormSubmitErrors(SMS_NUMBER_FORM)

export const getData = state => ({
  smsNumber: selectors.core.settings.getSmsNumber(state).getOrElse(''),
  step: selectors.components.identityVerification
    .getSmsStep(state)
    .getOrElse(null),
  countryCode: getCountryCode(state),
  activeField: activeFieldSelector(state),
  mobileVerifiedError: prop('mobileVerifiedError', submitErrorsSelector(state))
})

const determineCountryCode = (currentNumber, defaultCode) =>
  currentNumber ? PhoneNumber(currentNumber).getRegionCode() : defaultCode

const getCountryCode = state =>
  lift(determineCountryCode)(
    selectors.core.settings.getSmsNumber(state),
    selectors.core.settings.getCountryCode(state)
  )
