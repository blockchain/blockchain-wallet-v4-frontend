import { Button, Icon, Text } from 'blockchain-info-components'
import styled from 'styled-components'

import media from 'services/ResponsiveService'
import Navbar from './Navbar'
import NavbarBrand from './NavbarBrand'
import NavbarHeader from './NavbarHeader'
import NavbarMenu from './NavbarMenu'
import NavbarNav from './NavbarNav'
import NavbarNavItem from './NavbarNavItem'

export const NavbarNavItemIcon = styled(Icon)<{ persist?: boolean }>`
  color: ${props => props.theme.grey400};
  transition: color 0.3s;
  display: ${props => (props.persist ? 'block !important' : '')};
`

export const NavbarNavItemTextHeader = styled(Text)`
  color: ${props => props.theme.grey400};
  transition: color 0.3s;
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
      color: ${props => props.theme.whiteFade900};
    }
  }

  ${media.atLeastLaptopM`
    ${NavbarNavItemIcon} {
      margin-right: 8px;
    }
  `}

  ${media.laptopM`
    ${NavbarNavItemTextHeader} {
      margin-top: 4px;
    }
    flex-direction: column;
  `}

  ${media.laptop`
    ${NavbarNavItemTextHeader} {
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

export {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
}
