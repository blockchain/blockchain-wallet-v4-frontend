import styled from 'styled-components'

export const ListContainer = styled.div<{
  $isCollapsed: boolean
}>`
  overflow: hidden;
  transition: max-height 0.3s ease;

  max-height: ${(props) => (props.$isCollapsed ? '40px' : '200px')};
`
