import React, { useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import { LinePath } from '@visx/shape'

import { AnimatedLinePathComponent } from './types'

export const AnimatedLinePath: AnimatedLinePathComponent = ({
  curve,
  data,
  stroke,
  strokeWidth,
  x,
  y
}) => {
  const [styles, api] = useSpring(() => ({
    config: { duration: 100 },
    strokeWidth: 4
  }))

  useEffect(() => {
    api.start({ strokeWidth })
  }, [api, strokeWidth])

  return (
    <LinePath curve={curve} data={data} x={x} y={y}>
      {({ path }) => {
        return <animated.path fill='none' stroke={stroke} d={path(data) || undefined} {...styles} />
      }}
    </LinePath>
  )
}
