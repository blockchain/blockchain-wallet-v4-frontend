import { compose, includes, keys, lift, path, prop } from 'ramda'
import { formValueSelector } from 'redux-form'

import { model, selectors } from 'data'

const {
  getEmailStep,
  getSupportedCountries,
  getStates
} = selectors.components.identityVerification
const { getUserData } = selectors.modules.profile

const {
  PERSONAL_FORM,
  isStateSupported
} = model.components.identityVerification

const formValSelector = formValueSelector(PERSONAL_FORM)
const activeFieldSelector = selectors.form.getActiveField(PERSONAL_FORM)
const formErrorSelector = selectors.form.getFormSyncErrors(PERSONAL_FORM)
const formMetaSelector = selectors.form.getFormMeta(PERSONAL_FORM)

const formatUserData = ({
  state,
  kycState,
  id,
  address,
  mobile,
  ...userData
}) => ({
  ...userData,
  address,
  ...address
})

const isCountryAndStateSelected = state => {
  const country = prop('code', formValSelector(state, 'country'))
  if (!country) return false
  if (country !== 'US') return true

  return Boolean(formValSelector(state, 'state'))
}

const stateSupported = state => {
  const country = prop('code', formValSelector(state, 'country'))
  if (country !== 'US') return true

  return isStateSupported(formValSelector(state, 'state'))
}

const getCountryData = state =>
  lift((supportedCountries, states) => ({ supportedCountries, states }))(
    getSupportedCountries(state),
    getStates(state)
  )

export const getData = state => {
  const activeField = activeFieldSelector(state)
  return {
    initialCountryCode: selectors.core.settings
      .getCountryCode(state)
      .getOrElse(null),
    initialEmail: selectors.core.settings.getEmail(state).getOrElse(null),
    emailVerified: selectors.core.settings
      .getEmailVerified(state)
      .getOrElse(false),
    email: prop('code', formValSelector(state, 'email')),
    emailStep: getEmailStep(state),
    countryCode: prop('code', formValSelector(state, 'country')),
    postCode: formValSelector(state, 'postCode'),
    countryAndStateSelected: isCountryAndStateSelected(state),
    stateSupported: stateSupported(state),
    countryData: getCountryData(state),
    activeField,
    activeFieldError:
      path([activeField, 'touched'], formMetaSelector(state)) &&
      includes(activeField, keys(formErrorSelector(state))),
    userData: compose(
      lift(formatUserData),
      getUserData
    )(state),
    pathName: selectors.router.getPathname(state)
  }
}
