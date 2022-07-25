import styled, { css } from 'styled-components'

import { BaseBadgeComponent, BaseBadgeProps } from './BaseBadge.types'

export const BaseBadge: BaseBadgeComponent = styled.div<BaseBadgeProps>`
  ${({ backgroundColor, outlineColor, outlineSize = 0.25, size = 1.5, theme }) => css`
    background-color: ${backgroundColor || 'transparent'};
    outline-style: solid;
    outline-color: ${outlineColor || theme.white}
    outline-width: ${outlineSize}rem;
    height: ${size}rem;
    min-width: ${size}rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${size / 2}rem;
  `}
`
