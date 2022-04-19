import React, { useMemo } from 'react'

import { PaddingComponent } from './types'

const useEdgeInsetResolver = (
  all: number | undefined,
  axis: number | undefined,
  edge: number
): number =>
  useMemo(() => {
    if (all !== undefined) {
      return all
    }

    if (axis !== undefined) {
      return axis
    }

    return edge
  }, [all, axis, edge])

export const Padding: PaddingComponent = ({
  all,
  bottom = 0,
  children,
  horizontal,
  left = 0,
  right = 0,
  top = 0,
  vertical
}) => {
  const paddingTop = useEdgeInsetResolver(all, vertical, top)
  const paddingBottom = useEdgeInsetResolver(all, vertical, bottom)
  const paddingLeft = useEdgeInsetResolver(all, horizontal, left)
  const paddingRight = useEdgeInsetResolver(all, horizontal, right)

  return (
    <div
      style={{
        paddingBottom,
        paddingLeft,
        paddingRight,
        paddingTop
      }}
    >
      {children}
    </div>
  )
}
