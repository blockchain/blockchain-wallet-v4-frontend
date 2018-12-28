import { selectors } from 'data'

export const getData = state => ({
  hasEmail: selectors.core.settings
    .getEmail(state)
    .map(Boolean)
    .getOrElse(false),
  userCreated: selectors.modules.profile.isUserCreated(state)
})
