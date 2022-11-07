import React, { ReactNode } from 'react'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import { DefaultTheme, withTheme } from 'styled-components'

import 'react-circular-progressbar/dist/styles.css'

export type Props = {
  children?: ReactNode
  percentage: number
  strokeWidth?: number
}

const CircularProgressBar = ({
  children,
  percentage,
  strokeWidth = 8,
  theme
}: Props & { theme: DefaultTheme }) => {
  return (
    <CircularProgressbarWithChildren
      styles={buildStyles({
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

export default withTheme(CircularProgressBar)
