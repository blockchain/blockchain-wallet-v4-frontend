import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.grey100};
    border-radius: 12px;
  `}
`
