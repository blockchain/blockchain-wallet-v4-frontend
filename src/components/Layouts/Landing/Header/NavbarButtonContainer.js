import styled from 'styled-components'

const NavbarButtonContainer = styled.div`
  display: none;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 350px;
  white-space: nowrap;

  @media (min-width: 992px) { display: flex; }
`

export default NavbarButtonContainer
