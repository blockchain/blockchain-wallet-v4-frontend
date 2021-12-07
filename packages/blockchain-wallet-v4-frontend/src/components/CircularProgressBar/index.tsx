import React from 'react'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { withTheme } from 'styled-components'

import 'react-circular-progressbar/dist/styles.css'

const ProgressCircle = ({ children, percentage, strokeWidth, theme }) => {
  return (
    <CircularProgressbarWithChildren
      styles={buildStyles({
        backgroundColor: theme.blue600,
        pathColor: theme.blue600,
        trailColor: theme.grey000
      })}
      strokeWidth={strokeWidth}
      value={percentage}
    >
      {children}
    </CircularProgressbarWithChildren>
  )
}

export default withTheme(ProgressCircle)
