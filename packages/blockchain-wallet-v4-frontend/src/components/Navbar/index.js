import styled from 'styled-components'
import { transparentize } from 'polished'

import Navbar from './Navbar'
import NavbarBrand from './NavbarBrand'
import NavbarHeader from './NavbarHeader'
import NavbarMenu from './NavbarMenu'
import NavbarNav from './NavbarNav'
import NavbarIcon from './NavbarIcon'
import NavbarNavItem from './NavbarNavItem'

import { Icon, Link, Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'

export const NavbarNavItemTextLink = styled(Link)`
  display: flex;
  align-items: center;
  position: relative;
  .icon,
  .settings {
    transition: color 0.3s;
    color: ${props => transparentize(0.3, props.theme['white'])};
  }
  &.active,
  &:hover {
    .icon,
    .settings {
      color: ${props => props.theme['white']};
    }
  }
`
export const NavbarNavItemTextIcon = styled(Icon)`
  margin-right: 8px;
`
export const NavbarNavItemTextHeader = styled(Text)`
  ${media.tablet`
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
