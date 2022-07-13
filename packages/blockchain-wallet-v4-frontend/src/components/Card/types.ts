import { FC } from 'react'
import { colors } from '@blockchain-com/constellation'

export type CardBorderRadius = 'lg' | 'md'
export type CardElevation = 1

export type CardProps = {
  backgroundColor?: keyof typeof colors
  borderRadius?: CardBorderRadius
  borderWidth?: number
  elevation?: CardElevation
}

export type CardComponent = FC<CardProps>
