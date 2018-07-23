import { path } from 'ramda'
import { formValueSelector } from 'redux-form'
import { selectors } from 'data'
import { ADDRESS_FORM } from 'data/components/identityVerification/model'

export const getData = state => ({
  helperDomain: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  ),
  step: selectors.components.identityVerification.getStep(state).getOrElse(null)
})

const addressFormSelector = formValueSelector(ADDRESS_FORM)
export const getAddressData = state => ({
  initialValues: {
    countryCode: selectors.core.settings.getCountryCode(state).getOrElse(null)
  },
  countryCode: addressFormSelector(state, 'countryCode')
})
