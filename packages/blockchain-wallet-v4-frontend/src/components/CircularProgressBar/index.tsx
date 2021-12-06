import React from 'react'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'

import 'react-circular-progressbar/dist/styles.css'

const ProgressCircle = ({ children, percentage, strokeWidth }) => {
  return (
    <CircularProgressbarWithChildren
      styles={buildStyles({
        backgroundColor: '#0C6CF2',
        pathColor: '#0C6CF2',
        trailColor: '#F0F2F7'
      })}
      strokeWidth={strokeWidth}
      value={percentage}
    >
      {children}
    </CircularProgressbarWithChildren>
  )
}

export default ProgressCircle
