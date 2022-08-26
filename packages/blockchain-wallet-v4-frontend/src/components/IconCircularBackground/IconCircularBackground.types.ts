import { FC } from 'react'
import { colors } from '@blockchain-com/constellation'

export type IconCircularBackgroundColor = keyof typeof colors | string

export type IconCircularBackgroundSizes = 'default' | 'large'

export type IconCircularBackgroundProps = {
  backgroundOpacity?: number
  color: IconCircularBackgroundColor
  size?: IconCircularBackgroundSizes | number
}

export type IconCircularBackgroundComponent = FC<IconCircularBackgroundProps>
