import React from 'react'
import styled, { css } from 'styled-components'

import { BaseBadge } from '../BaseBadge'
import { IconBadgeComponent } from './IconBadge.types'

export const IconBadge = styled<IconBadgeComponent>(({ color, ...props }) => (
  <BaseBadge {...props} />
))`
  ${({ color, size = 1.5, theme }) => css`
    height: ${size}rem;
    width: ${size}rem;
    font-size: ${size}rem;
    color: ${color ? theme[color] || color : 'inherit'};
  `}
`
