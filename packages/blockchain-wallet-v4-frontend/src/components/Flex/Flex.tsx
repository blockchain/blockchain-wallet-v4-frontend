import React, { CSSProperties, useMemo } from 'react'

import { FlexComponent } from './types'

export const Flex: FlexComponent = ({
  alignItems,
  children,
  flexDirection,
  gap,
  justifyContent
}) => {
  const style: CSSProperties = useMemo(() => {
    return {
      alignItems,
      display: 'flex',
      flexDirection,
      gap: gap ? `${gap}px` : undefined,
      justifyContent
    }
  }, [alignItems, justifyContent, gap, flexDirection])

  return <div style={style}>{children}</div>
}
