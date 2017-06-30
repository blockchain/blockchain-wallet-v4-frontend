import styled from 'styled-components'

const NavbarButtonMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  width: 40px;
  border-radius: 2px;
  padding: 5px;
  border-box: box-sizing;
  cursor: pointer;
  background-color: ${props => props.mobileDisplay ? props.theme.colors.blue.secondary : 'transparent'};

  @media (min-width: 768px) { display: none; }
`

export default NavbarButtonMenu
