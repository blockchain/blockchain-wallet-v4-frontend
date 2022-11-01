import { FC, ReactNode } from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

export type IconCircularBackgroundColor = keyof typeof PaletteColors | string

export type IconCircularBackgroundSizes = 'default' | 'large'

export type IconCircularBackgroundProps = {
  backgroundOpacity?: number
  children?: ReactNode
  color: IconCircularBackgroundColor
  size?: IconCircularBackgroundSizes | number
}

export type IconCircularBackgroundComponent = FC<IconCircularBackgroundProps>
