import { selectors } from 'data'
import { UserDataType } from 'data/types'

export const getData = (state) => {
  const userData = selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
  const country = userData?.address?.country
  return { country }
}
