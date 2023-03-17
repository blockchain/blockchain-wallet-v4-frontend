import Remote from '@core/remote'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { VERIFY_EMAIL_FORM } = model.components.identityVerification

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(VERIFY_EMAIL_FORM)(state)
  const email = selectors.core.settings.getEmail(state).getOrElse('')

  // TODO we can remove this
  return Remote.Success({
    email,
    formErrors
  })
}
