import styled, { css } from 'styled-components'

export const CardWrapper = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.grey000};
    border-radius: 16px;
  `}
`
