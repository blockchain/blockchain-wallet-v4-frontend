import { selectors } from 'data'
import { UserDataType, UserTierType } from 'data/types'

export const getData = state => {
  const userData = selectors.modules.profile
    .getUserData(state)
    .getOrElse({} as UserDataType)
  // @ts-ignore
  const userTiers = selectors.modules.profile
    .getTiers(state)
    .getOrElse({} as UserTierType)
  const emailVerified = selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false)
  const mobileVerified = selectors.core.settings
    .getSmsVerified(state)
    .getOrElse(false)
  return { userData, userTiers, emailVerified, mobileVerified }
}
