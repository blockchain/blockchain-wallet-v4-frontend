import React, { FC, useMemo } from 'react'
import { RouteComponentProps } from 'react-router'

import { Flex } from 'components/Flex'
import { useCoinConfig } from 'hooks'

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
  const [acoutSection] = useCoinAboutSection({ coin })
  const [holdingsCard] = useHoldingsCard({ coin })
  const [recurringBuyPanel] = useRecurringBuyPanel({ coin })
  const [tabsNode, { selectedTimeRange }] = useTabs({ coin })
  const [walletsCard] = useWalletsCard(coin)
  const { data: coinfig, isLoading: isLoadingCoinConfig } = useCoinConfig({ coin })
  const [activityFeed] = useActivityFeed({ coin })

  const displayName = useMemo(() => coinfig?.name, [coinfig])

  const [chart] = useChart({
    timeRange: selectedTimeRange
  })

  const [chartBalancePanel] = useChartBalancePanel({
    coin
  })

  if (isLoadingCoinConfig) {
    return <span>Loading</span>
  }

  return (
    <Flex alignItems='center'>
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
    </Flex>
  )
}

export default CoinPageContainer
