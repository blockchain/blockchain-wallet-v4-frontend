import { formValueSelector } from 'redux-form'
import { compose, prop } from 'ramda'

import { selectors, model } from 'data'

const {
  getSupportedCountries,
  getPossibleAddresses,
  isAddressRefetchVisible
} = selectors.components.identityVerification
const { getApiToken, getUserData } = selectors.modules.profile

const { PERSONAL_FORM } = model.components.identityVerification

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
  supportedCountries: getSupportedCountries(state),
  activeField: activeFieldSelector(state),
  userData: compose(
    formatUserData,
    getUserData
  )(state)
})
