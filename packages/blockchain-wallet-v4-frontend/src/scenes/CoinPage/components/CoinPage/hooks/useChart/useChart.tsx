import React, { ReactNode, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import moment from 'moment'

import { selectors } from 'data'

import { CoinChart } from '../../../CoinChart'
import { usePriceIndexSeries } from '../usePriceIndexSeries'

export const useChart = (): [ReactNode] => {
  const seriesData = useSelector(selectors.core.data.misc.getPriceIndexSeries)

  const data = usePriceIndexSeries(seriesData.data)

  const chartNode = useMemo(() => {
    return seriesData.cata({
      Failure: () => <span>Failure</span>,
      Loading: () => <span>Loading</span>,
      NotAsked: () => <span>NotAsked</span>,
      Success: () => (
        <CoinChart
          data={data}
          backgroundColor={colors.white060}
          primaryColor={colors.blue600}
          textColor={colors.grey400}
          x='date'
          y='price'
          xFormatter={(date) => moment(date.valueOf()).format('hh:mm')}
        />
      )
    })
  }, [seriesData, data])

  return [chartNode]
}
