import { formValueSelector } from 'redux-form'
import { compose, lift, prop } from 'ramda'

import { selectors, model } from 'data'

const {
  getSupportedCountries,
  getStates,
  getPossibleAddresses,
  isAddressRefetchVisible
} = selectors.components.identityVerification
const { getApiToken, getUserData } = selectors.modules.profile

const {
  PERSONAL_FORM,
  isStateSupported
} = model.components.identityVerification

const formValSelector = formValueSelector(PERSONAL_FORM)
const activeFieldSelector = selectors.form.getActiveField(PERSONAL_FORM)

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

export const getData = state => ({
  addressRefetchVisible:
    isAddressRefetchVisible(state) || getApiToken(state).error,
  initialCountryCode: selectors.core.settings
    .getCountryCode(state)
    .getOrElse(null),
  possibleAddresses: getPossibleAddresses(state),
  countryCode: prop('code', formValSelector(state, 'country')),
  postCode: formValSelector(state, 'postCode'),
  address: formValSelector(state, 'address'),
  countryAndStateSelected: isCountryAndStateSelected(state),
  stateSupported: stateSupported(state),
  countryData: getCountryData(state),
  activeField: activeFieldSelector(state),
  userData: compose(
    formatUserData,
    getUserData
  )(state)
})
