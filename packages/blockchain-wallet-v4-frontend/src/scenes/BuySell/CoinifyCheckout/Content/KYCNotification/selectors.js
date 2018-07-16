import { selectors } from 'data'

export const getData = (state) => ({
  showKycCompleted: selectors.preferences.getShowKycCompleted(state)
})
