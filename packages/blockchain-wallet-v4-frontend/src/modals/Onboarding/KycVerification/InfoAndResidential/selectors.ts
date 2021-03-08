import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { compose, lift } from 'ramda'

import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { INFO_AND_RESIDENTIAL_FORM } = model.components.identityVerification

// remove unused stuff from userDetails
/* eslint-disable */
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
/* eslint-disable */

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(
    INFO_AND_RESIDENTIAL_FORM
  )(state)
  const supportedCountriesR = selectors.components.identityVerification.getSupportedCountries(
    state
  )
  const userData = compose(
    lift(formatUserData),
    selectors.modules.profile.getUserData
  )(state)

  return lift(
    (supportedCountries: ExtractSuccess<typeof supportedCountriesR>) => ({
      formErrors,
      userData,
      supportedCountries
    })
  )(supportedCountriesR)
}
