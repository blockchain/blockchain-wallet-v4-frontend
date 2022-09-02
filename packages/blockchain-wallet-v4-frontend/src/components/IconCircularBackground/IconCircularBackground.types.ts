import { FC } from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

export type IconCircularBackgroundColor = keyof typeof PaletteColors | string

export type IconCircularBackgroundSizes = 'default' | 'large'

export type IconCircularBackgroundProps = {
  backgroundOpacity?: number
  color: IconCircularBackgroundColor
  size?: IconCircularBackgroundSizes | number
}

export type IconCircularBackgroundComponent = FC<IconCircularBackgroundProps>
