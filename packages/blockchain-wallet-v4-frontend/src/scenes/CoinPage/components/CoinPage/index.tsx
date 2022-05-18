import React, { FC, useMemo } from 'react'
import { RouteComponentProps } from 'react-router'

import { Flex } from 'components/Flex'
import { useCoinConfig } from 'hooks'

import { AboutSection } from '../AboutSection'
import { CoinHeader } from '../CoinHeader'
import { CoinPage } from './CoinPage'
import {
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
  const coinfig = useCoinConfig({ coin })

  const displayName = useMemo(() => coinfig.name, [coinfig.name])

  const [chart] = useChart({
    timeRange: selectedTimeRange
  })

  const [chartBalancePanel] = useChartBalancePanel({
    coin
  })

  return (
    <Flex alignItems='center'>
      <CoinPage
        chartTabs={tabsNode}
        about={acoutSection}
        chart={chart}
        header={<CoinHeader coinCode={coin} coinDescription='' coinName={displayName} />}
        chartBalancePanel={chartBalancePanel}
        recurringBuys={recurringBuyPanel}
        holdings={holdingsCard}
        wallets={walletsCard}
      />
    </Flex>
  )
}

export default CoinPageContainer
