import { ReactNode } from 'react'

import { CoinType } from '@core/types'

type ActivityFeedHookProps = {
  coin: CoinType
}

type ActivityFeedHook = (props: ActivityFeedHookProps) => [ReactNode]

export type { ActivityFeedHook, ActivityFeedHookProps }
