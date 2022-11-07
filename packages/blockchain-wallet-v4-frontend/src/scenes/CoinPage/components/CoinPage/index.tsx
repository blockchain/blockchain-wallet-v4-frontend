import React, { FC } from 'react'
import { RouteComponentProps } from 'react-router'

import { FiatType } from '@core/types'
import { selectors } from 'data'
import { useCoinConfig, useRemote } from 'hooks'

import { CoinHeader } from '../CoinHeader'
import { CoinPage } from './CoinPage'
import {
  useActivityFeed,
  useChart,
  useChartBalancePanel,
  useCoinAboutSection,
  useHoldingsCard,
  useRecurringBuyPanel,
  useTabs,
  useWalletsCard
} from './hooks'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer: FC<RouteComponentProps> = ({ computedMatch }) => {
  const { coin } = computedMatch.params
  const { data: currency } = useRemote<unknown, FiatType>(selectors.core.settings.getCurrency)
  const [acoutSection] = useCoinAboutSection({ coin })
  const [holdingsCard] = useHoldingsCard({ coin })
  const [recurringBuyPanel] = useRecurringBuyPanel({ coin })
  const [tabsNode, { selectedTimeRange }] = useTabs({ coin })
  const [walletsCard] = useWalletsCard(coin)
  const { data: coinfig, isLoading: isLoadingCoinConfig } = useCoinConfig({ coin })
  const [activityFeed] = useActivityFeed({ coin })

  const [chart] = useChart({
    currency: currency ?? 'USD',
    timeRange: selectedTimeRange
  })

  const [chartBalancePanel] = useChartBalancePanel({
    coin
  })

  if (isLoadingCoinConfig) {
    return <span>Loading</span>
  }

  return (
    <CoinPage
      chartTabs={tabsNode}
      about={acoutSection}
      chart={chart}
      header={<CoinHeader coinCode={coin} coinDescription='' coinName={coinfig?.name ?? ''} />}
      chartBalancePanel={chartBalancePanel}
      recurringBuys={recurringBuyPanel}
      holdings={holdingsCard}
      wallets={walletsCard}
      activity={activityFeed}
    />
  )
}

export default CoinPageContainer
