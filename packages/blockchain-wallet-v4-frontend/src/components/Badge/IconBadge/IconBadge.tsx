import React from 'react'
import styled, { css } from 'styled-components'

import { BaseBadge } from '../BaseBadge'
import { IconBadgeComponent } from './IconBadge.types'

export const IconBadge = styled<IconBadgeComponent>(({ color, ...props }) => (
  <BaseBadge {...props} />
))`
  ${({ color, size = 32, theme }) => css`
    height: ${size}px;
    width: ${size}px;
    font-size: ${size}px;
    color: ${color ? theme[color] || color : 'inherit'};
  `}
`
