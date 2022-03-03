import styled, { css } from 'styled-components'

import { PaddingComponent, PaddingProps } from './types'

export const Padding: PaddingComponent = styled.div<PaddingProps>`
  ${({ bottom = 0, left = 0, right = 0, top = 0 }) => css`
    padding-bottom: ${bottom}px;
    padding-left: ${left}px;
    padding-right: ${right}px;
    padding-top: ${top}px;
  `}
`
