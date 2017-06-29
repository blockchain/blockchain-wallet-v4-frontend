import styled from 'styled-components'

const NavbarButtonContainer = styled.div`
  display: none;
  justify-content: space-around;
  width: 350px;
  white-space: nowrap;

  @media (min-width: 768px) { display: flex; }
`

export default NavbarButtonContainer
