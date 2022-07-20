import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme }) => css`
    border: 1px solid ${theme.grey000};
    border-radius: 8px;
    transition: background-color 0.3s, border-color 0.3s;
    cursor: pointer;

    &:hover {
      background-color: ${theme.blue000};
      border-color: ${theme.blue000};
    }
  `}
`
