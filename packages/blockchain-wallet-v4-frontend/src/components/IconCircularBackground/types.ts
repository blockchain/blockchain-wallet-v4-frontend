import { FC } from 'react'
import { colors } from '@blockchain-com/constellation'

export type IconCircularBackgroundSizes = 'default'

export type IconCircularBackgroundProps = {
  color: keyof typeof colors | string
  size?: IconCircularBackgroundSizes | number
}

export type IconCircularBackgroundComponent = FC<IconCircularBackgroundProps>
