import { selectors } from 'data'

export const getData = state =>
  selectors.core.settings.getHint(state)
