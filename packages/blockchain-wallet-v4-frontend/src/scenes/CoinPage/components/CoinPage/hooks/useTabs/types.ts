import { ReactNode } from 'react'

import { TimeRange } from '@core/types'

export type UseTabsArgs = {
  coin: string
}

export type UseTabsResult = [
  ReactNode,
  {
    selectedTimeRange: TimeRange
  }
]

export type UseTabs = (args: UseTabsArgs) => UseTabsResult
