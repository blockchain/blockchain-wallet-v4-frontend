import styled, { css } from 'styled-components'

import { CardComponent, CardProps } from './types'

export const Card: CardComponent = styled.div<CardProps>`
  ${({ elevation, theme }) => {
    if (!elevation) {
      return css`
        border: 1px solid ${theme.grey100};
        border-radius: 12px;
        overflow: hidden;
      `
    }

    return css`
      box-shadow: 0px 3px 1px 0px #0000000a, 0px 3px 8px 0px #0000001f;
      padding: 1px;
      border-radius: 12px;
      overflow: hidden;
    `
  }}
`
