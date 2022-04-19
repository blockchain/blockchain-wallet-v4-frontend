import styled, { css } from 'styled-components'

export const TooltipCard = styled.div`
  ${({ theme }) => css`
    border-radius: 4px;
    background-color: ${theme.grey900};
  `}
`
