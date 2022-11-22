import { EarnEDDStatus, RewardsRatesType, StakingRatesType } from '@core/types'
import { UserDataType } from 'data/types'

export type SuccessStateType = {
  earnEDDStatus: EarnEDDStatus
  interestRates: RewardsRatesType
  interestRatesArray: Array<number>
  stakingRates: StakingRatesType
  userData: UserDataType
}

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T
}
