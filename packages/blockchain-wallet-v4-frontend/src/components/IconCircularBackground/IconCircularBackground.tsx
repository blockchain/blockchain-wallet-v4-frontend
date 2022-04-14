import React from 'react'
import { colors } from '@blockchain-com/constellation'

import { IconCircularBackgroundComponent, IconCircularBackgroundSizes } from './types'

export const IconCircularBackground: IconCircularBackgroundComponent = ({
  children,
  color = 'defualt',
  size = 'default'
}) => {
  const sizeToPixels: Record<IconCircularBackgroundSizes, number> = {
    default: 24
  }

  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: colors[color],
        borderRadius: '50%',
        display: 'flex',
        height: sizeToPixels[size] ?? size,
        justifyContent: 'center',
        width: sizeToPixels[size] ?? size
      }}
    >
      {children}
    </div>
  )
}
