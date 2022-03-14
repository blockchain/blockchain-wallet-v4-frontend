import { FC } from 'react'
import { TickFormatter } from '@visx/axis'
import { Numeric } from 'd3-array'

import { ScaleTime } from 'components/Chart/hooks'

export type AxisBottomProps = {
  numTicks?: number
  scale: ScaleTime
  textColor: string
  tickFormat?: TickFormatter<Date | Numeric>
  top: number
}

export type AxisBottomComponent = FC<AxisBottomProps>
