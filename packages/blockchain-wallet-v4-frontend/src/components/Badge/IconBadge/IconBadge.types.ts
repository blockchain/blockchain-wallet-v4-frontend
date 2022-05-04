import { FC } from 'react'

import { BaseBadgeProps } from '../BaseBadge'

export type IconBadgeProps = BaseBadgeProps & {
  color?: string
}

export type IconBadgeComponent = FC<IconBadgeProps>
