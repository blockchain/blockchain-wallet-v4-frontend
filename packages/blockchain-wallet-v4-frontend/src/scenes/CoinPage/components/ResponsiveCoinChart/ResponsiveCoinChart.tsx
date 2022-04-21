import React, { useMemo } from 'react'
import useMeasure from 'react-use-measure'

import { CoinChart } from '../CoinChart'
import { ResponsiveCoinChartComponent } from './types'

export const ResponsiveCoinChart: ResponsiveCoinChartComponent = (props) => {
  const [ref, { height, width }] = useMeasure()

  const isContainerEmpty = useMemo(() => {
    return height === 0 && width === 0
  }, [height, width])

  return (
    <div ref={ref} style={{ height: '100%', width: '100%' }}>
      {isContainerEmpty ? null : <CoinChart height={height} width={width} {...props} />}
    </div>
  )
}
