import { ReactElement } from 'react'

import { CoinChartProps, CoinData } from '../CoinChart'

export type ResponsiveCoinChartProps<DATA extends CoinData> = Omit<
  CoinChartProps<DATA>,
  'width' | 'height'
>

export type ResponsiveCoinChartComponent = <DATA extends CoinData = CoinData>(
  props: ResponsiveCoinChartProps<DATA>
) => ReactElement
