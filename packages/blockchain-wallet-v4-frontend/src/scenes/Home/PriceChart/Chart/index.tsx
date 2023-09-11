import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { TimeRange } from '@core/types'
import { priceChart } from 'data/components/actions'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Chart from './template.success'

const ChartContainer = () => {
  const dispatch = useDispatch()
  const { cache, currency, data } = useSelector(getData)

  useEffect(() => {
    const coin = cache.coin ?? 'BTC'
    const time = cache.time ?? TimeRange.MONTH
    dispatch(priceChart.initialized(coin, time))
  }, [cache.coin, cache.time])

  return data.cata({
    Failure: (message) => <Error>{message}</Error>,
    Loading: () => <Loading />,
    NotAsked: () => <Loading />,
    Success: (value) => <Chart currency={currency} coin={value.coin} data={value.data} />
  })
}

export default ChartContainer
