import { formValueSelector } from 'redux-form'
import { selectors, model } from 'data'
import { prop } from 'ramda'

const {
  getSupportedCountries,
  getPossibleAddresses,
  isAddressRefetchVisible
} = selectors.components.identityVerification
const { getApiToken } = selectors.modules.profile

const { PERSONAL_FORM } = model.components.identityVerification

const personalFormSelector = formValueSelector(PERSONAL_FORM)

export const getData = state => ({
  addressRefetchVisible:
    isAddressRefetchVisible(state) || getApiToken(state).error,
  initialCountryCode: selectors.core.settings
    .getCountryCode(state)
    .getOrElse(null),
  possibleAddresses: getPossibleAddresses(state),
  countryCode: prop('code', personalFormSelector(state, 'country')),
  address: personalFormSelector(state, 'address'),
  supportedCountries: getSupportedCountries(state)
})
