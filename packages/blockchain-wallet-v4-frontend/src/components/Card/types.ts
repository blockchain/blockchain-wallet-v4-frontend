import { FC } from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

export type CardBorderRadius = 'lg' | 'md'
export type CardElevation = 1

export type CardProps = {
  backgroundColor?: keyof typeof PaletteColors
  borderRadius?: CardBorderRadius
  borderWidth?: number
  elevation?: CardElevation
}

export type CardComponent = FC<CardProps>
