import { selectors } from 'data'

export const getData = state => {
  const userData = selectors.modules.profile.getUserData(state).getOrElse(null)
  const userTiers = selectors.modules.profile.getTiers(state).getOrElse(null)
  return { userData, userTiers }
}
