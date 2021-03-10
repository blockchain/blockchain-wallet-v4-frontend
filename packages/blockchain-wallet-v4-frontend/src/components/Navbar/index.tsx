import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

import Navbar from './Navbar'
import NavbarBrand from './NavbarBrand'
import NavbarHeader from './NavbarHeader'
import NavbarMenu from './NavbarMenu'

export const NavbarNavItemIcon = styled(Icon)<{ persist?: boolean }>`
  color: ${props => props.theme[props.color || 'whiteFade900']};
  transition: color 0.3s;
  display: ${props => (props.persist ? 'flex !important' : '')};
`

export const NavbarNavItemTextHeader = styled(Text)<{ persist?: boolean }>`
  color: ${props => props.theme[props.color || 'whiteFade900']};
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
      margin-top: 0px;
    }
    ${NavbarNavItemIcon} {
      display: none;
    }
  `}
`

export const NavbarNavItem = styled.li`
  box-sizing: border-box;
  padding: 0px 16px;
  margin: 0 -1px;
  cursor: pointer;

  &.active {
    background: ${props => props.theme.grey800};
    border-radius: 8px;
    ${NavbarNavItemIcon},
    ${NavbarNavItemTextHeader} {
      color: ${props => props.theme.white} !important;
    }
  }

  ${media.laptopM`
    padding: 4px 16px;
    margin: 0 -2px;
  `}

  ${media.laptop`
    padding: 0 16px;
    margin: 0 -2px;
  `}

  ${media.tablet`
    padding: 0px 8px;
    &:last-child {
      padding-right: 0px;
    }
  `}
`

export const NavbarDivider = styled.div`
  height: 20px;
  border-left: 1px solid ${props => props.theme.grey800};

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

export { Navbar, NavbarBrand, NavbarHeader, NavbarMenu }
