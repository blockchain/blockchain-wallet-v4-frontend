import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import FaqIcon from './FaqIcon'
import WhatsNewIcon from './WhatsNewIcon'
import RefreshIcon from './RefreshIcon'
import Logout from './Logout'

import { Image } from 'blockchain-info-components'
import { Navbar, NavbarBrand, NavbarHeader, NavbarMenu, NavbarNav, NavbarNavItem, NavbarToggler } from 'components/Navbar'

const MenuLeftToggler = styled(NavbarToggler)`
  left: 20px;
`

const Header = (props) => {
  const { navigationToggled, handleToggleNavigation, handleTrayRightToggle, handleToggleMenuLeft, trayRightOpen, trayRightContent } = props

  return (
    <Navbar height='60px'>
      <MenuLeftToggler onToggle={handleToggleMenuLeft} />
      <NavbarHeader>
        <NavbarBrand>
          <NavLink to='/'>
            <Image name='blockchain-vector' height='20px' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenu toggled={navigationToggled}>
        <div />
        <NavbarNav>
          <NavbarNavItem>
            <FaqIcon trayRightContent={trayRightContent} handleTrayRightToggle={handleTrayRightToggle} trayRightOpen={trayRightOpen}/>
          </NavbarNavItem>
          <NavbarNavItem>
            <WhatsNewIcon trayRightContent={trayRightContent} handleTrayRightToggle={handleTrayRightToggle} trayRightOpen={trayRightOpen}/>
          </NavbarNavItem>
          <NavbarNavItem>
            <RefreshIcon />
          </NavbarNavItem>
          <NavbarNavItem>
            <Logout />
          </NavbarNavItem>
        </NavbarNav>
      </NavbarMenu>
      <NavbarToggler onToggle={handleToggleNavigation} />
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
