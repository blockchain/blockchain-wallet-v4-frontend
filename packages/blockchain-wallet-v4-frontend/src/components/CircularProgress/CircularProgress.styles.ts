import styled, { css } from 'styled-components'

export const StyledSVG = styled.svg`
  transform: rotate(-90deg);
`

export const ProgressCircle = styled.circle<{ value: number }>`
  ${({ value }) => css`
    stroke-dasharray: 100;
    stroke-dashoffset: calc(100 - ${value});
    transition: stroke-dashoffset 250ms;
  `}
`
