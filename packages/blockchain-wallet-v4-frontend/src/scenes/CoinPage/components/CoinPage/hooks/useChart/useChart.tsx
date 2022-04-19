import React, { ReactNode, useMemo } from 'react'
import { colors } from '@blockchain-com/constellation'
import { usePriceIndexSeries } from 'blockchain-wallet-v4-frontend/src/hooks'

import { createCoinChartTooltipBuilder } from '../../../CoinChartTooltip'
import { ResponsiveCoinChart } from '../../../ResponsiveCoinChart'
import { createDateFormatterFromSelectedTimeRange } from '../../utils/createChartDateFormatterFromSelectedTimeRange'
import { findNumTicksFromTimeRange } from '../../utils/findNumTicksFromTimeRange'
import { UseChartArgs } from './types'

export const useChart = ({ timeRange }: UseChartArgs): [ReactNode] => {
  const { data, hasError, isLoading, isNotAsked } = usePriceIndexSeries()

  const xFormatter = useMemo(() => {
    return createDateFormatterFromSelectedTimeRange(timeRange)
  }, [timeRange])

  const chartNode = useMemo(() => {
    if (isLoading || isNotAsked) return <span>Loading</span>

    if (hasError) return <span>Failure</span>

    if (!data) return <span>No Data</span>

    return (
      <ResponsiveCoinChart
        data={data}
        backgroundColor={colors.white060}
        primaryColor={colors.blue600}
        textColor={colors.grey400}
        x='timestamp'
        y='price'
        xFormatter={xFormatter}
        numTicks={findNumTicksFromTimeRange(timeRange)}
        tooltip={createCoinChartTooltipBuilder()}
      />
    )
  }, [data, isLoading, isNotAsked, hasError, xFormatter])

  return [chartNode]
}
