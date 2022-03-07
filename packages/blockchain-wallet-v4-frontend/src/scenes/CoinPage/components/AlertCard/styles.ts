import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme }) => css`
    border-radius: 8px;
    background-color: ${theme.grey000};
  `}
`
