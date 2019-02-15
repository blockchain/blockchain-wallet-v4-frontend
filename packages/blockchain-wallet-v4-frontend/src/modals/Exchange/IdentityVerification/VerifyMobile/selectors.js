import { contains, keys, path } from 'ramda'

import { selectors, model } from 'data'

const { SMS_NUMBER_FORM } = model.components.identityVerification
const activeFieldSelector = selectors.form.getActiveField(SMS_NUMBER_FORM)
const formErrorSelector = selectors.form.getFormSyncErrors(SMS_NUMBER_FORM)
const formMetaSelector = selectors.form.getFormMeta(SMS_NUMBER_FORM)

export const getData = state => {
  const activeField = activeFieldSelector(state)
  return {
    smsNumber: selectors.core.settings.getSmsNumber(state).getOrElse(''),
    step: selectors.components.identityVerification
      .getSmsStep(state)
      .getOrElse(null),
    countryCode: selectors.modules.profile
      .getUserCountryCode(state)
      .getOrElse('US'),
    activeField,
    activeFieldError:
      path([activeField, 'touched'], formMetaSelector(state)) &&
      contains(activeField, keys(formErrorSelector(state)))
  }
}
