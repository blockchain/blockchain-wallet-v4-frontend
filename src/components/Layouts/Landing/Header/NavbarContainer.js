import styled from 'styled-components'

const NavbarContainer = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  
  @media (min-width: 544px) { width: 540px; margin: 0 auto; }
  @media (min-width: 768px) { width: 720px; }
  @media (min-width: 992px) { width: 960px; }
  @media (min-width: 1200px) { width: 1140px; }
`

export default NavbarContainer
