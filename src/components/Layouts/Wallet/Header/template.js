import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Ticker from './Ticker'
import ExploreMenu from './ExploreMenu'
import WhatsNew from './WhatsNew'
import Refresh from './Refresh'
import Logout from './Logout'

import logo from 'img/blockchain-vector.svg'
import { Navbar, NavbarBrand, NavbarHeader, NavbarToggle, NavbarCollapse, Nav, RouterLink } from 'blockchain-components'

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
const MenuLeftToggler = styled.button`
  display: block;
  margin-top: 4px;
  margin-right: 10px;
  float: left;
  cursor: pointer;
  padding: 9px 10px;
  background-color: transparent;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;

  @media(min-width: 768px) { display: none; }
`

const MenuLeftTogglerBar = styled.span`
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 1px;
  margin-top: 4px;
  background-color: #FFFFFF;
`

const Header = (props) => {
  const { navigationToggled, handleToggleNavigation, handleToggleMenuLeft } = props
  return (
    <Wrapper>
      <Navbar fluid inverse defaultExpanded={navigationToggled}>
        <NavbarHeader>
          <MenuLeftToggler onClick={handleToggleMenuLeft}>
            <MenuLeftTogglerBar />
            <MenuLeftTogglerBar />
            <MenuLeftTogglerBar />
          </MenuLeftToggler>
          <NavbarBrand>
            <RouterLink to='/'><Logo /></RouterLink>
          </NavbarBrand>
          <NavbarToggle onClick={handleToggleNavigation} />
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
  handleToggleNavigation: PropTypes.func.isRequired,
  handleToggleMenuLeft: PropTypes.func.isRequired,
  navigationToggled: PropTypes.bool.isRequired
}

export default Header
