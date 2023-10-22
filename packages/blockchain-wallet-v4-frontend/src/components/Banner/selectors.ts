import { selectors } from 'data'
import { UserDataType } from 'data/types'

export const getData = (state) => {
  const loginMetadata = selectors.auth.getProductAuthMetadata(state)
  const userData = selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
  const country = userData?.address?.country
  const ipCountry = loginMetadata?.ipCountry
  return { country, ipCountry }
}
