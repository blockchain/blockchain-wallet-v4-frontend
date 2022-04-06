import React, { FC, useMemo } from 'react'

import { CoinHeader } from '..'
import { AboutSection } from '../AboutSection'
import { CoinPage } from './CoinPage'
import {
  useChart,
  useChartBalancePanel,
  useHoldingsCard,
  useRecurringBuyPanel,
  useTabs,
  useWalletsCard
} from './hooks'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer: FC<{ coin: string }> = ({ coin }) => {
  const [tabsNode, { selectedTimeRange }] = useTabs({ coin })
  const [walletsCard] = useWalletsCard(coin)
  const [recurringBuyPanel] = useRecurringBuyPanel({ coin })

  const [chart] = useChart({
    timeRange: selectedTimeRange
  })

  const [chartBalancePanel] = useChartBalancePanel({
    coin
  })

  const [holdingsCard] = useHoldingsCard({
    coin
  })

  const { coinfig } = useMemo(() => window.coins[coin], [coin])
  const displayName = useMemo(() => coinfig.name, [coinfig.name])

  return (
    <CoinPage
      chartTabs={tabsNode}
      about={<AboutSection content='' title={coin} actions={[<></>]} />}
      chart={chart}
      header={<CoinHeader coinCode={coin} coinDescription='' coinName={displayName} />}
      chartBalancePanel={chartBalancePanel}
      recurringBuys={recurringBuyPanel}
      holdings={holdingsCard}
      wallets={walletsCard}
    />
  )
}

export default CoinPageContainer
