import React from 'react'
import { AxisBottom as VisxAxisBottom } from '@visx/axis'

import { AxisBottomComponent } from './types'

export const AxisBottom: AxisBottomComponent = ({
  numTicks,
  scale,
  textColor,
  tickFormat,
  top
}) => {
  return (
    <VisxAxisBottom
      scale={scale}
      hideAxisLine
      hideTicks
      hideZero
      numTicks={numTicks}
      tickFormat={tickFormat}
      top={top}
      tickLabelProps={() => ({
        fill: textColor,
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 22,
        textAnchor: 'middle',
        verticalAnchor: 'middle'
      })}
    />
  )
}
