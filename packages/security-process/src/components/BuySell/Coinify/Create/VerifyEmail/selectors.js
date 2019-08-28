import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

export const getData = state => ({
  emailCode: formValueSelector('coinifyVerifyEmail')(state, 'emailCode'),
  emailAddress: formValueSelector('coinifyVerifyEmail')(state, 'emailAddress'),
  emailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false),
  emailStep: selectors.components.identityVerification.getEmailStep(state)
})
