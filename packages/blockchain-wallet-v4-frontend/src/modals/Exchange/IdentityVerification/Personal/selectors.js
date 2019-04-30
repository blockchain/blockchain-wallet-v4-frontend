import { formValueSelector } from 'redux-form'
import { compose, lift, prop, test, contains, keys, path } from 'ramda'

import { selectors, model } from 'data'

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

const getCoinifyUserCountry = state => {
  const profileCountry = selectors.core.data.coinify
    .getCountry(state)
    .getOrElse(null)
  const userSelectedCountry = selectors.components.coinify.getCoinifyCountry(
    state
  )
  return userSelectedCountry || profileCountry
}

const shouldSkipCountrySelection = state => {
  const path = selectors.router.getPathname(state)
  const onBuySell = test(/buy-sell/, path)
  // if user is on buy-sell and the coinify country has been set because
  // an account has been created or the country has been selected as part of signup
  return onBuySell && getCoinifyUserCountry(state)
}

const isCountryAndStateSelected = state => {
  const country = prop('code', formValSelector(state, 'country'))
  if (shouldSkipCountrySelection(state)) return true
  if (!country) return false
  if (country !== 'US') return true

  return Boolean(formValSelector(state, 'state'))
}

const stateSupported = state => {
  const country = prop('code', formValSelector(state, 'country'))
  if (shouldSkipCountrySelection(state)) return true
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
      contains(activeField, keys(formErrorSelector(state))),
    userData: compose(
      lift(formatUserData),
      getUserData
    )(state),
    coinifyUserCountry: getCoinifyUserCountry(state),
    pathName: selectors.router.getPathname(state)
  }
}
