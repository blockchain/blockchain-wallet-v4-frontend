import { FC } from 'react'
import { colors } from '@blockchain-com/constellation'

export type IconCircularBackgroundSizes = 'default' | 'large'

export type IconCircularBackgroundProps = {
  backgroundOpacity?: number
  color: keyof typeof colors | string
  size?: IconCircularBackgroundSizes | number
}

export type IconCircularBackgroundComponent = FC<IconCircularBackgroundProps>
