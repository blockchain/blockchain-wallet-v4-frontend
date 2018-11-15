import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { Icon, Image } from 'blockchain-info-components'
import FaqIcon from './FaqIcon'
import WhatsNewIcon from './WhatsNewIcon'
import RefreshIcon from './RefreshIcon'
import Logout from './Logout'
import Announcements from './Announcements'
import ServiceAnnouncement from 'components/ServiceAnnouncement'
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

const Header = props => (
  <React.Fragment>
    <Navbar height='60px'>
      <NavbarHeader>
        <NavbarBrand>
          <Icon
            name='hamburger-menu'
            color='white'
            size='16px'
            onClick={props.handleToggle}
          />
          <NavLink to='/home' data-e2e='homeLink'>
            <BlockchainLogoImage name='blockchain-vector' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenu>
        <div />
        <NavbarNav>
          <NavbarNavItem>
            <WhatsNewIcon />
          </NavbarNavItem>
          <NavbarNavItem>
            <RefreshIcon />
          </NavbarNavItem>
          <NavbarNavItem>
            <FaqIcon />
          </NavbarNavItem>
          <NavbarNavItem>
            <Logout />
          </NavbarNavItem>
        </NavbarNav>
      </NavbarMenu>
    </Navbar>
    <ServiceAnnouncement alertArea='wallet' />
    <Announcements />
  </React.Fragment>
)

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired
}

export default Header
