import React, { useMemo } from 'react'

import { useCoinPrice, useCurrency } from 'hooks'

import { ChartBalancePanel } from '../../../ChartBalancePanel'
import { useFormatFiat } from '../useFormatFiat'
import { UseChartBalancePanel } from './types'

export const useChartBalancePanel: UseChartBalancePanel = ({ coin }) => {
  const currency = useCurrency()

  const { data: coinPrice } = useCoinPrice({ coin, range: 'WEEK' })

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
  }, [coin, coinPrice, formattedCurrentPrice, formattedHourPrice])

  return [chartBalancePanelNode]
}
