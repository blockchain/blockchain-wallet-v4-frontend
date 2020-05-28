import { Icon, Image } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarDivider,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'
import { NavLink } from 'react-router-dom'
import React from 'react'
import Refresh from './Refresh'
import SecurityCenter from './SecurityCenter'
import SendRequest from './SendRequest'
import Settings from './Settings'
import styled from 'styled-components'

type Props = {
  handleToggle: () => void
}

const BlockchainLogoImage = styled(Image)`
  width: 200px;
  display: block;
  height: 20px;
  margin-left: 0;
`
const NavbarStyled = styled(Navbar)`
  background-color: ${props => props.theme.grey900};
`
const NavbarMenuStyled = styled(NavbarMenu)`
  width: 100%;
`

const Large: React.FC<Props> = props => {
  return (
    <NavbarStyled height='60px'>
      <NavbarHeader>
        <NavbarBrand>
          <Icon
            name='hamburger-menu'
            color='whiteFade600'
            size='16px'
            onClick={props.handleToggle}
          />
          <NavLink to='/home' data-e2e='homeLink'>
            <BlockchainLogoImage name='blockchain-logo' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenuStyled>
        <NavbarNav>
          <SendRequest />
        </NavbarNav>
        <NavbarNav>
          <NavbarNavItem>
            <SecurityCenter />
          </NavbarNavItem>
          <NavbarDivider />
          <NavbarNavItem>
            <Refresh />
          </NavbarNavItem>
          <NavbarDivider />
          <NavbarNavItem>
            <Settings {...props} />
          </NavbarNavItem>
        </NavbarNav>
      </NavbarMenuStyled>
    </NavbarStyled>
  )
}

export default Large
