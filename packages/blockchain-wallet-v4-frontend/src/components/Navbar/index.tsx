import { Button, Icon, Text } from 'blockchain-info-components'
import styled from 'styled-components'

import media from 'services/ResponsiveService'
import Navbar from './Navbar'
import NavbarBrand from './NavbarBrand'
import NavbarHeader from './NavbarHeader'
import NavbarMenu from './NavbarMenu'
import NavbarNavItem from './NavbarNavItem'

export const NavbarNavItemIcon = styled(Icon)<{ persist?: boolean }>`
  color: ${props => props.theme[props.color || 'grey400']};
  transition: color 0.3s;
  display: ${props => (props.persist ? 'block !important' : '')};
`

export const NavbarNavItemTextHeader = styled(Text)<{ persist?: boolean }>`
  color: ${props => props.theme[props.color || 'grey400']};
  transition: color 0.3s;
  display: ${props => (props.persist ? 'block !important' : '')};
`

export const NavbarNavItemButton = styled(Button)`
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.3s;
  background: transparent;
  min-width: auto;
  width: auto;
  padding: 0;
  border: 0;
  &:hover {
    background-color: transparent;
    ${NavbarNavItemIcon},
    ${NavbarNavItemTextHeader} {
      color: ${props => props.theme.whiteFade900} !important;
    }
  }

  ${media.atLeastLaptopM`
    ${NavbarNavItemIcon} {
      margin-right: 8px;
    }
  `}

  ${media.laptopM`
    flex-direction: column;
    ${NavbarNavItemTextHeader} {
      margin-top: 4px;
    }
  `}

  ${media.laptop`
    flex-direction: row;
    ${NavbarNavItemTextHeader} {
      margin-left: 8px;
      margin-top: 0px;
    }
    ${NavbarNavItemIcon} {
      display: none;
    }
  `}
`
export const NavbarDivider = styled.div`
  height: 20px;
  border-left: 1px solid ${props => props.theme.whiteFade400};

  ${media.laptopM`
    height: 40px;
  `}

  ${media.laptop`
    height: 20px;
  `}
`

export const NavbarNav = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style-type: none;
  &:hover {
    ${NavbarNavItemIcon},
    ${NavbarNavItemTextHeader} {
      color: ${props => props.theme.grey600};
    }
  }
`

export { Navbar, NavbarBrand, NavbarHeader, NavbarMenu, NavbarNavItem }
