import React from 'react'
import { Line } from '@visx/shape'

import { VerticalDashedLineComponent } from './types'

export const VerticalDashedLine: VerticalDashedLineComponent = ({ bottom, color, left, top }) => (
  <Line
    from={{ x: left, y: top }}
    to={{ x: left, y: bottom }}
    stroke={color}
    strokeWidth={1}
    pointerEvents='none'
    strokeDasharray='4,2'
  />
)
