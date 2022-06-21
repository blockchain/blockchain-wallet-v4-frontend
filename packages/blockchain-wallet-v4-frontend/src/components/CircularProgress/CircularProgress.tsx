import React from 'react'

import { ProgressCircle, StyledSVG } from './CircularProgress.styles'
import { CircularProgressComponent } from './CircularProgress.types'

const CircularProgress: CircularProgressComponent = ({
  fill = 'currentColor',
  value,
  ...props
}) => {
  const strokeWidth = 4
  const viewPortSize = 24

  const radius = viewPortSize / 2 - strokeWidth / 2

  return (
    <StyledSVG viewBox={`0 0 ${viewPortSize} ${viewPortSize}`} {...props} fill={fill}>
      <circle
        cx={viewPortSize / 2}
        cy={viewPortSize / 2}
        r={radius}
        fill='none'
        stroke={fill}
        opacity={0.1}
        strokeWidth={strokeWidth}
      />
      <ProgressCircle
        cx={viewPortSize / 2}
        cy={viewPortSize / 2}
        r={radius}
        fill='none'
        stroke={fill}
        strokeWidth={strokeWidth}
        pathLength='100'
        value={value}
      />
    </StyledSVG>
  )
}

export { CircularProgress }
