import { selectors } from 'data'
import { formValueSelector } from 'redux-form'
import { ADDRESS_FORM } from 'data/components/identityVerification/model'
import { prop } from 'ramda'

const {
  getSupportedCountries,
  getPossibleAddresses
} = selectors.components.identityVerification
const addressFormSelector = formValueSelector(ADDRESS_FORM)
export const getData = state => ({
  initialCountryCode: selectors.core.settings
    .getCountryCode(state)
    .getOrElse(null),
  supportedCountries: getSupportedCountries(state),
  possibleAddresses: getPossibleAddresses(state),
  countryCode: prop('code', addressFormSelector(state, 'country')),
  address: addressFormSelector(state, 'address')
})
