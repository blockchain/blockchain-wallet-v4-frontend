import { Icon, Link, Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import Navbar from './Navbar'
import NavbarBrand from './NavbarBrand'
import NavbarHeader from './NavbarHeader'
import NavbarIcon from './NavbarIcon'
import NavbarMenu from './NavbarMenu'
import NavbarNav from './NavbarNav'
import NavbarNavItem from './NavbarNavItem'
import styled from 'styled-components'

export const NavbarNavItemTextLink = styled(Link)`
  display: flex;
  align-items: center;
  position: relative;
  .icon,
  .settings {
    transition: color 0.3s;
    color: ${props => props.theme.whiteFade700};
  }
  &.active,
  &:hover {
    .icon,
    .settings {
      color: ${props => props.theme.whiteFade900};
    }
  }
  ${media.tabletL`
    .icon,
    .settings {
      transition: color 0.3s;
      color: ${props => props.theme.whiteFade900};
    }
  `}
`
export const NavbarNavItemTextIcon = styled(Icon)<{ className: string }>`
  margin-right: 8px;
`
export const NavbarNavItemTextHeader = styled(Text)<{ className: string }>`
  ${media.tabletL`
    display: none;
  `}
`

export {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarIcon,
  NavbarNavItem
}
