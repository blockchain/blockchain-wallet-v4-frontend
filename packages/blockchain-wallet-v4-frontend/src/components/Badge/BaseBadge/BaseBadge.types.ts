import { FC } from 'react'

export type BaseBadgeProps = {
  backgroundColor?: string
  outlineColor?: string
  outlineSize?: number
  size?: number
}

export type BaseBadgeComponent = FC<BaseBadgeProps>
