import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = state => {
  const authType = selectors.core.settings.getAuthType(state)
  const googleAuthSecretUrl = selectors.core.settings.getGoogleAuthSecretUrl(state)

  const f = (a, g) => ({ authType: a, googleSecret: g })

  return lift(f)(authType, googleAuthSecretUrl)
}
