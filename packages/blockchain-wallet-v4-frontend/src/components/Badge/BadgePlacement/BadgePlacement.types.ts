import { FC, ReactNode } from 'react'

export type BadgePlacementProps = {
  badge?: ReactNode
  placement?: 'start' | 'end'
  shape?: 'circle' | 'square'
}

export type BadgePlacementComponent = FC<BadgePlacementProps>
