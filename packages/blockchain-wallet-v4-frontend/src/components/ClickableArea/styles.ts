import styled, { css } from 'styled-components'

type ContainerProps = {
  showBackgroundOnHover: boolean
}
export const Container = styled.div<ContainerProps>`
  ${({ showBackgroundOnHover, theme }) => css`
  & > div {
    transition: transform 0.05s;
  }
  
  ${showBackgroundOnHover &&
    css`
      cursor: pointer;
      
      &:hover {
        background-color: ${theme.grey000};
      }

      &:active > div {
        transform: scale(0.98);
      }
    `}
  `}
`
