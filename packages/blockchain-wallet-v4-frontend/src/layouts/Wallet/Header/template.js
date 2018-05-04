import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import FaqIcon from './FaqIcon'
import WhatsNewIcon from './WhatsNewIcon'
import RefreshIcon from './RefreshIcon'
import Logout from './Logout'

import { Icon, Image } from 'blockchain-info-components'
import { Navbar, NavbarBrand, NavbarHeader, NavbarMenu, NavbarNav, NavbarNavItem } from 'components/Navbar'

const BlockchainLogoImage = styled(Image)`
  height: 16px;
  display: block;
  margin-left: 10px;
  @media (min-width: 768px) {
    height: 20px;
    margin-left: 0px;
  }
`

const Header = (props) => {
  const { navigationToggled, handleTrayRightToggle, handleToggleMenuLeft, trayRightOpen, trayRightContent } = props

  return (
    <Navbar height='60px'>
      <NavbarHeader>
        <NavbarBrand>
          <Icon name='hamburger-menu' color='white' size='16px' onClick={handleToggleMenuLeft} />
          <NavLink to='/home'>
            <BlockchainLogoImage name='blockchain-vector' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenu toggled={navigationToggled}>
        <div />
        <NavbarNav>
          <NavbarNavItem>
            <FaqIcon trayRightContent={trayRightContent} handleTrayRightToggle={handleTrayRightToggle} trayRightOpen={trayRightOpen} />
          </NavbarNavItem>
          <NavbarNavItem>
            <WhatsNewIcon trayRightContent={trayRightContent} handleTrayRightToggle={handleTrayRightToggle} trayRightOpen={trayRightOpen} />
          </NavbarNavItem>
          <NavbarNavItem>
            <RefreshIcon />
          </NavbarNavItem>
          <NavbarNavItem>
            <Logout />
          </NavbarNavItem>
        </NavbarNav>
      </NavbarMenu>
    </Navbar>
  )
}

Header.propTypes = {
  trayRightContent: PropTypes.string.isRequired,
  handleToggleNavigation: PropTypes.func.isRequired,
  handleToggleMenuLeft: PropTypes.func.isRequired,
  handleTrayRightToggle: PropTypes.func.isRequired,
  navigationToggled: PropTypes.bool.isRequired,
  trayRightOpen: PropTypes.bool.isRequired
}

export default Header
