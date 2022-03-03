import { Remote } from '@core'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserTierType } from 'data/types'

const getData = (state: RootState) => {
  // @ts-ignore
  const userTiers = selectors.modules.profile.getTiers(state).getOrElse({} as UserTierType)

  return Remote.Success({
    userTiers
  })
}

export default getData
