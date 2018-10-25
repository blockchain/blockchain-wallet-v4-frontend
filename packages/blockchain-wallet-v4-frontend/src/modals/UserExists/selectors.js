import { selectors } from 'data'

export const getData = state => ({
  email: selectors.core.settings.getEmail(state).getOrElse('')
})
