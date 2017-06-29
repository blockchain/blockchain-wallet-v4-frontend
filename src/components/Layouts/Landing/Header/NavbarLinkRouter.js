import styled from 'styled-components'
import * as ReactRouterDom from 'react-router-dom'

const NavbarLinkRouter = styled(ReactRouterDom.NavLink)`
  padding: 0 10px;
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.colors.white};
    text-decoration: none;
  }

  &:focus {
    color: ${props => props.theme.colors.white};
    text-decoration: none;
  }
`

export default NavbarLinkRouter
