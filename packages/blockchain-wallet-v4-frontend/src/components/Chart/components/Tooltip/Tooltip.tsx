import React from 'react'
import { defaultStyles, TooltipWithBounds as VisxTooltipWithBounds } from '@visx/tooltip'

import { TooltipCard } from './styles'
import { TooltipComponent } from './types'

export const Tooltip: TooltipComponent = ({ children, left, offsetLeft, offsetTop, top }) => {
  return (
    <VisxTooltipWithBounds
      top={top}
      left={left}
      offsetLeft={offsetLeft}
      offsetTop={offsetTop}
      style={{
        ...defaultStyles,
        boxShadow: 'none',
        padding: 'none'
      }}
    >
      <TooltipCard>{children}</TooltipCard>
    </VisxTooltipWithBounds>
  )
}
