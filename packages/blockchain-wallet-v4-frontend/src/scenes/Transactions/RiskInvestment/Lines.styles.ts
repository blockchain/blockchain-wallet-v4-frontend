import styled, { css } from 'styled-components'

export const ListContainer = styled.div<{
  isCollapsed: boolean
}>`
  overflow: hidden;
  transition: max-height 0.3s ease;

  ${({ isCollapsed }) =>
    isCollapsed
      ? css`
          max-height: 40px;
        `
      : css`
          max-height: 200px;
        `}
`

export const ListItem = styled.li`
  list-style: none;
  overflow: hidden;
`
