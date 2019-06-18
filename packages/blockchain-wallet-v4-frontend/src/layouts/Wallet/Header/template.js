import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { transparentize } from 'polished'

import { Icon, Image } from 'blockchain-info-components'
import FaqIcon from './FaqIcon'
import WhatsNewIcon from './WhatsNewIcon'
import RefreshIcon from './RefreshIcon'
import SecurityCenter from './SecurityCenter'
import Settings from './Settings'
import Announcements from 'components/Announcements'
import media from 'services/ResponsiveService'
import {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'

const BlockchainLogoImage = styled(Image)`
  height: 16px;
  display: block;
  margin-left: 10px;
  @media (min-width: 768px) {
    height: 20px;
    margin-left: 0;
  }
`
const NavbarNavItemSpacer = styled(NavbarNavItem)`
  margin-right: 12px;
`
const NavbarNavItemWithText = styled(NavbarNavItem)`
  padding: 0 24px;
  margin: 0px;
  border-left: 1px solid ${props => transparentize(0.9, props.theme['white'])};
  &:last-child {
    padding-right: 0px;
  }
  ${media.tablet`
    padding: 0px;
    border-left: 0px;
  `}
`

const Header = props => {
  const { handleToggle, ...rest } = props
  return (
    <React.Fragment>
      <Navbar height='60px'>
        <NavbarHeader>
          <NavbarBrand>
            <Icon
              name='hamburger-menu'
              color='white'
              size='16px'
              onClick={handleToggle}
            />
            <NavLink to='/home' data-e2e='homeLink'>
              <BlockchainLogoImage name='blockchain-vector' />
            </NavLink>
          </NavbarBrand>
        </NavbarHeader>
        <NavbarMenu>
          <NavbarNav>
            <NavbarNavItem>
              <WhatsNewIcon />
            </NavbarNavItem>
            <NavbarNavItem>
              <RefreshIcon />
            </NavbarNavItem>
            <NavbarNavItemSpacer>
              <FaqIcon />
            </NavbarNavItemSpacer>
            <NavbarNavItemWithText>
              <SecurityCenter {...rest} />
            </NavbarNavItemWithText>
            <NavbarNavItemWithText>
              <Settings {...rest} />
            </NavbarNavItemWithText>
          </NavbarNav>
        </NavbarMenu>
      </Navbar>
      <Announcements type='service' alertArea='wallet' />
      <Announcements type='static' />
    </React.Fragment>
  )
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired
}

export default Header
