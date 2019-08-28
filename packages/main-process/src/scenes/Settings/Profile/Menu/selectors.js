import { selectors } from 'data'

export const getData = state => ({
  userTiers: selectors.modules.profile.getTiers(state).getOrElse({})
})
