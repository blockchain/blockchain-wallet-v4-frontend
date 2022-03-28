import styled, { css } from 'styled-components'

import { CardComponent, CardProps } from './types'

export const Card: CardComponent = styled.div<CardProps>`
  ${({ theme }) => css`
    border: 1px solid ${theme.grey100};
    border-radius: 12px;
    overflow: hidden;
  `}
`
