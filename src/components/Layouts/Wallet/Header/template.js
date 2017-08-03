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
  height: 20px;
  margin-top: 18px;
`
const MenuToggle = styled.div``

const Header = (props) => {
  const { toggled, handleToggle } = props

  return (
    <Wrapper>
      <Navbar fluid inverse defaultExpanded={toggled}>
        <NavbarHeader>
          <MenuToggle />
          <NavbarBrand>
            <RouterLink to='/'><Logo /></RouterLink>
          </NavbarBrand>
          <NavbarToggle onClick={handleToggle} />
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
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default Header
