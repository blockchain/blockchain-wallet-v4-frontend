import { Icon, Link, Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import Navbar from './Navbar'
import NavbarBrand from './NavbarBrand'
import NavbarHeader from './NavbarHeader'
import NavbarMenu from './NavbarMenu'
import NavbarNav from './NavbarNav'
import NavbarNavItem from './NavbarNavItem'
import styled from 'styled-components'

export const NavbarNavItemIcon = styled(Icon)`
  color: ${props => props.theme.grey400};
  margin-right: 8px;
  transition: color 0.3s;
`

export const NavbarNavItemTextHeader = styled(Text)`
  color: ${props => props.theme.grey400};
  transition: color 0.3s;
  ${media.tabletL`
    display: none;
  `}
`

export const NavbarNavItemTextLink = styled(Link)<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.3s;
  &.active,
  &:hover {
    ${NavbarNavItemIcon},
    ${NavbarNavItemTextHeader} {
      color: ${props => props.theme.whiteFade900};
    }
  }
  ${media.tabletL`
    ${NavbarNavItemIcon},
    ${NavbarNavItemTextHeader} {
      color: ${props => props.theme.whiteFade900};
    }
  `}
`
export const NavbarDivider = styled.div`
  height: 18px;
  border-left: 1px solid ${props => props.theme.grey400};
`

export {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
}
