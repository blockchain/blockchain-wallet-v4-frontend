import React from 'react'
import { colors } from '@blockchain-com/constellation'

import { IconCircularBackgroundComponent, IconCircularBackgroundSizes } from './types'

export const IconCircularBackground: IconCircularBackgroundComponent = ({
  backgroundOpacity = 1,
  children,
  color = 'default',
  size = 'default'
}) => {
  const sizeToPixels: Record<IconCircularBackgroundSizes, number> = {
    default: 24,
    large: 32
  }

  return (
    <div
      style={{
        height: sizeToPixels[size] ?? size,
        position: 'relative',
        width: sizeToPixels[size] ?? size
      }}
    >
      <div
        style={{
          backgroundColor: colors[color] ?? color,
          borderRadius: '50%',
          height: sizeToPixels[size] ?? size,
          opacity: backgroundOpacity,
          position: 'absolute',
          width: sizeToPixels[size] ?? size
        }}
      />

      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: sizeToPixels[size] ?? size,
          justifyContent: 'center',
          position: 'absolute',
          width: sizeToPixels[size] ?? size
        }}
      >
        {children}
      </div>
    </div>
  )
}
