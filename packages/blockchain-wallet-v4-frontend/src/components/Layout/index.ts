import styled from 'styled-components'

export const StickyHeader = styled.div`
  background-color: ${props => props.theme.white};
  position: sticky;
  width: 100%;
  z-index: 1;
  top: 0;
`
