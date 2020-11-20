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
  const quoteR = selectors.components.simpleBuy.getSBQuote(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const supportedCountriesR = selectors.components.identityVerification.getSupportedCountries(
    state
  )

  return lift(
    (
      invitations: ExtractSuccess<typeof invitationsR>,
      quote: ExtractSuccess<typeof quoteR>,
      userData: ExtractSuccess<typeof userDataR>,
      supportedCountries: ExtractSuccess<typeof supportedCountriesR>
    ) => ({
      formErrors,
      invitations,
      quote,
      userData,
      supportedCountries
    })
  )(invitationsR, quoteR, userDataR, supportedCountriesR)
}
