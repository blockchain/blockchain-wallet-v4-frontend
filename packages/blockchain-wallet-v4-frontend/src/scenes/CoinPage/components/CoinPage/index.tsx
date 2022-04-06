import React, { FC } from 'react'
import { useCoinConfig } from 'blockchain-wallet-v4-frontend/src/hooks'

import { CoinHeader } from '..'
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

  const { name: displayName } = useCoinConfig({ coin })

  return (
    <CoinPage
      chartTabs={tabsNode}
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
