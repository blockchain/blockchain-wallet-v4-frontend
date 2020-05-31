import { Icon, Image } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'
import { NavLink } from 'react-router-dom'
import React from 'react'
import RefreshIcon from './RefreshIcon'
import SecurityCenter from './SecurityCenter'
import SendRequest from './SendRequest'
import Settings from './Settings'
import styled from 'styled-components'
import WhatsNewIcon from './WhatsNewIcon'

type Props = {
  handleToggle: () => void
}

const NavbarNavItemSpacer = styled(NavbarNavItem)`
  margin-right: 24px;
`
const NavbarNavItemWithText = styled(NavbarNavItem)`
  padding: 0 26px;
  margin: 0;
  border-left: 1px solid ${props => props.theme.whiteFade400};
  &:last-child {
    padding-right: 0;
  }
`
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
        <SendRequest />
        <NavbarNav style={{ marginRight: '8px' }}>
          <NavbarNavItem>
            <WhatsNewIcon />
          </NavbarNavItem>
          <NavbarNavItemSpacer>
            <RefreshIcon />
          </NavbarNavItemSpacer>
          <NavbarNavItemWithText>
            <SecurityCenter />
          </NavbarNavItemWithText>
          <NavbarNavItemWithText>
            <Settings {...props} />
          </NavbarNavItemWithText>
        </NavbarNav>
      </NavbarMenuStyled>
    </NavbarStyled>
  )
}

export default Large
