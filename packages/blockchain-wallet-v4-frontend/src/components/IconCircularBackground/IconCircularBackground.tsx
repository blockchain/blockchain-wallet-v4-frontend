import React from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

import { IconCircularBackgroundComponent, IconCircularBackgroundSizes } from './types'

export const IconCircularBackground: IconCircularBackgroundComponent = ({
  children,
  color = 'default',
  size = 'default'
}) => {
  const sizeToPixels: Record<IconCircularBackgroundSizes, number> = {
    default: 24
  }

  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: PaletteColors[color] ?? color,
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
