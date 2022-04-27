import styled, { css } from 'styled-components'

import { BaseBadgeComponent, BaseBadgeProps } from './BaseBadge.types'

export const BaseBadge: BaseBadgeComponent = styled.div<BaseBadgeProps>`
  ${({ backgroundColor, outlineColor, outlineSize = 4, size = 32, theme }) => css`
    background-color: ${backgroundColor || 'transparent'};
    outline-style: solid;
    outline-color: ${outlineColor || theme.white}
    outline-width: ${outlineSize}px;
    height: ${size}px;
    min-width: ${size}px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${size / 2}px;
  `}
`
