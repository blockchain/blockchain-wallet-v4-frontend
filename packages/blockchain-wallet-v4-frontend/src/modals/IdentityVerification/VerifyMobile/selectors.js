import { selectors, model } from 'data'

const { SMS_NUMBER_FORM } = model.components.identityVerification
const activeFieldSelector = selectors.form.getActiveField(SMS_NUMBER_FORM)

export const getData = state => ({
  smsNumber: selectors.core.settings.getSmsNumber(state).getOrElse(''),
  step: selectors.components.identityVerification
    .getSmsStep(state)
    .getOrElse(null),
  countryCode: selectors.modules.profile
    .getUserCountryCode(state)
    .getOrElse('US'),
  activeField: activeFieldSelector(state)
})
