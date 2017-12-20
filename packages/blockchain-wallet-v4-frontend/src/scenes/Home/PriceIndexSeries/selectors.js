import { selectors } from 'data'

export const getData = (state) => ({
  value: selectors.core.settings.getSettings(state)
})
