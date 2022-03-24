import React, { useMemo } from 'react'

import { ChartBalancePanel } from '../../../ChartBalancePanel'
import { useCoinPrice } from '../useCoinPrice'
import { useCurrency } from '../useCurrency'
import { useFormatFiat } from '../useFormatFiat'
import { UseChartBalancePanel } from './types'

export const useChartBalancePanel: UseChartBalancePanel = ({ coin }) => {
  const currency = useCurrency()

  const coinPrice = useCoinPrice({ coin })

  const currentPrice = coinPrice?.currentPrice

  const formattedCurrentPrice = useFormatFiat({
    currency,
    value: currentPrice ?? 0
  })

  const overallChange: number = useMemo(() => {
    if (!coinPrice) return 0

    try {
      return parseFloat(coinPrice.overallChange.diff)
    } catch (err) {
      return 0
    }
  }, [coinPrice])

  const formattedHourPrice = useFormatFiat({
    currency,
    value: overallChange
  })

  const chartBalancePanelNode = useMemo(() => {
    if (!coinPrice) {
      return <ChartBalancePanel coinCode={coin} pastHourChange='--' pastHourPrice='--' price='--' />
    }

    return (
      <ChartBalancePanel
        coinCode={coin}
        pastHourChange={coinPrice.overallChange.percentChange}
        isPositive={coinPrice.overallChange.movement === 'up'}
        pastHourPrice={formattedHourPrice}
        price={formattedCurrentPrice}
      />
    )
  }, [coinPrice])

  return [chartBalancePanelNode]
}
