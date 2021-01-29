import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import { UserTierType } from 'data/types'

export const getData = (state: RootState) => {
  const userDataR = selectors.modules.profile.getUserData(state)
  // @ts-ignore
  const userTiers = selectors.modules.profile
    .getTiers(state)
    .getOrElse({} as UserTierType)

  const sddEligibleR = selectors.components.simpleBuy.getSddEligible(state)

  return lift(
    (
      userData: ExtractSuccess<typeof userDataR>,
      sddEligible: ExtractSuccess<typeof sddEligibleR>
    ) => ({
      userData,
      userTiers,
      sddEligible
    })
  )(userDataR, sddEligibleR)
}
