import { EarnEDDStatus, EarnRatesType, RewardsRatesType } from '@core/types'
import { UserDataType } from 'data/types'

export type SuccessStateType = {
  activeRewardsRates: EarnRatesType
  earnEDDStatus: EarnEDDStatus
  interestRates: RewardsRatesType
  interestRatesArray: Array<number>
  stakingRates: EarnRatesType
  userData: UserDataType
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T
}
