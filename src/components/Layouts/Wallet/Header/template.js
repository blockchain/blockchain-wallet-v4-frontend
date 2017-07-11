import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Ticker from './Ticker'
import ExploreMenu from './ExploreMenu'
import WhatsNew from './WhatsNew'
import Refresh from './Refresh'
import Logout from './Logout'

import logo from 'img/blockchain-vector.svg'
import { RouterLink } from 'components/generic/Link'
import { Navbar, NavbarBrand, NavbarHeader, NavbarToggle, NavbarCollapse, Nav } from 'components/generic/Navbar'

const Wrapper = styled.div`
  & .navbar-header {  height: 60px; }
  & .navbar-inverse { margin: 0; }
`
const Logo = styled.img.attrs({
  src: logo
})`
  display: block;
  height: 22px;
  margin: 15px;
`
const MenuToggle = styled.div`

`
const Header = (props) => (
  <Wrapper>
    <Navbar fluid inverse defaultExpanded={props.headerMenuDisplayed}>
      <NavbarHeader>
        <MenuToggle />
        <NavbarBrand>
          <RouterLink to='/'><Logo /></RouterLink>
        </NavbarBrand>
        <NavbarToggle onClick={props.clickHeaderMenu} />
      </NavbarHeader>
      <NavbarCollapse>
        <Nav pullRight>
          <Ticker />
          <ExploreMenu />
          <WhatsNew />
          <Refresh />
          <Logout />
        </Nav>
      </NavbarCollapse>
    </Navbar>
  </Wrapper>
)

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default Header
