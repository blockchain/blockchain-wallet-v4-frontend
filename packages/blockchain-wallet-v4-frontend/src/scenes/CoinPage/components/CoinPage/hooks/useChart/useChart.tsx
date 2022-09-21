import React, { ReactNode, useCallback, useMemo } from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

import { fiatToString } from '@core/exchange/utils'
import { SpinningLoader } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { usePriceIndexSeries } from 'hooks'

import { createCoinChartTooltipBuilder } from '../../../CoinChartTooltip'
import { ResponsiveCoinChart } from '../../../ResponsiveCoinChart'
import { createDateFormatterFromSelectedTimeRange } from '../../utils/createChartDateFormatterFromSelectedTimeRange'
import { findNumTicksFromTimeRange } from '../../utils/findNumTicksFromTimeRange'
import { UseChartArgs } from './types'

export const useChart = ({ currency, timeRange }: UseChartArgs): [ReactNode] => {
  const { data, hasError, isLoading, isNotAsked } = usePriceIndexSeries()

  const xFormatter = useMemo(() => {
    return createDateFormatterFromSelectedTimeRange(timeRange)
  }, [timeRange])

  const yTooltipFormatter = useCallback(
    (value) => {
      return fiatToString({
        unit: currency,
        value
      })
    },
    [currency]
  )

  const chartNode = useMemo(() => {
    if (isLoading || isNotAsked)
      return (
        <Flex alignItems='center' justifyContent='center' style={{ height: '100%' }}>
          <SpinningLoader width='24px' height='24px' borderWidth='4px' />
        </Flex>
      )

    if (hasError) return <span>Failure</span>

    if (!data) return <span>No Data</span>

    return (
      <ResponsiveCoinChart
        data={data}
        backgroundColor={PaletteColors['white-060']}
        primaryColor={PaletteColors['blue-600']}
        textColor={PaletteColors['grey-400']}
        x='timestamp'
        y='price'
        xFormatter={xFormatter}
        numTicks={findNumTicksFromTimeRange(timeRange)}
        tooltip={createCoinChartTooltipBuilder({ yFormatter: yTooltipFormatter })}
      />
    )
  }, [isLoading, isNotAsked, hasError, data, xFormatter, timeRange, yTooltipFormatter])

  return [chartNode]
}
