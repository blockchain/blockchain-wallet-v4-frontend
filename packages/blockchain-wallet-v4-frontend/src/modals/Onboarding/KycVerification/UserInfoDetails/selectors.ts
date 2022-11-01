import { compose, lift } from 'ramda'

import { Remote } from '@core'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { USER_INFO_DETAILS } = model.components.identityVerification

// remove unused stuff from userDetails
/* eslint-disable */
const formatUserData = ({ state, kycState, id, address, mobile, ...userData }) => ({
  ...userData,
  address,
  ...address
})
/* eslint-disable */

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(USER_INFO_DETAILS)(state)

  const userData = compose(
    lift(formatUserData),
    selectors.modules.profile.getUserData
  )(state).getOrElse({})

  return Remote.Success({
    formErrors,
    userData
  })
}

export default getData
