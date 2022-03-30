import styled, { css } from 'styled-components'

type ContainerProps = {
  showBackgroundOnHover: boolean
}
export const Container = styled.div<ContainerProps>`
  ${({ showBackgroundOnHover, theme }) => css`
    cursor: pointer;

    ${showBackgroundOnHover &&
    css`
      &:hover {
        background-color: ${theme.grey000};
      }
    `}
  `}
`
