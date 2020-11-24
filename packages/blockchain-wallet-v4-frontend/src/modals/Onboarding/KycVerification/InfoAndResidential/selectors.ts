import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { INFO_AND_RESIDENTIAL_FORM } = model.components.identityVerification

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(
    INFO_AND_RESIDENTIAL_FORM
  )(state)
  const invitationsR = selectors.core.settings.getInvitations(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const supportedCountriesR = selectors.components.identityVerification.getSupportedCountries(
    state
  )

  return lift(
    (
      invitations: ExtractSuccess<typeof invitationsR>,
      userData: ExtractSuccess<typeof userDataR>,
      supportedCountries: ExtractSuccess<typeof supportedCountriesR>
    ) => ({
      formErrors,
      invitations,
      userData,
      supportedCountries
    })
  )(invitationsR, userDataR, supportedCountriesR)
}
