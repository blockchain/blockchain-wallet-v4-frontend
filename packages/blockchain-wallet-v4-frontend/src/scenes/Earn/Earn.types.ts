import { ChangeEvent } from 'react'

import { EarnEDDStatus, RewardsRatesType, StakingRatesType } from '@core/types'
import { EarnTabsType, UserDataType } from 'data/types'

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

export type EarnFilterPropsType = {
  earnTab: EarnTabsType
  handleAssetClick: (status: boolean) => void
  handleHistoryClick: () => void
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  handleTabClick: (tab: string) => void
  showAvailableAssets: boolean
}
