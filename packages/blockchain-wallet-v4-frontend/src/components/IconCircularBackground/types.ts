import { FC } from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

export type IconCircularBackgroundSizes = 'default'

export type IconCircularBackgroundProps = {
  color: keyof typeof PaletteColors | string
  size?: IconCircularBackgroundSizes | number
}

export type IconCircularBackgroundComponent = FC<IconCircularBackgroundProps>
