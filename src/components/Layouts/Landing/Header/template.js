import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import logo from 'img/blockchain-vector.svg'
import { PrimaryButton, SecondaryButton } from 'components/generic/Button'
import { Text } from 'components/generic/Text'
import { Navbar, NavbarBrand, NavbarHeader, NavbarToggle, NavbarCollapse, Nav, NavItem } from 'components/generic/Navbar'

const NavbarWrapper = styled.div`
  & .navbar-header { height: 50px; }
  & li { margin-top: 2px; }
`
const NavbarLogo = styled.img.attrs({
  src: logo
})`
  display: block;
  height: 22px;
  margin: 15px;
`
const Header = (props) => {
  return (
    <NavbarWrapper>
      <Navbar inverse expanded={props.headerMenuDisplayed} onToggle>
        <NavbarHeader>
          <NavbarBrand>
            <NavLink to='/'><NavbarLogo /></NavLink>
          </NavbarBrand>
          <NavbarToggle onClick={props.clickHeaderMenu} />
        </NavbarHeader>
        <NavbarCollapse>
          <Nav>
            <li>
              <NavLink to='/wallet'>
                <Text id='components.layouts.landing.header.wallets' text='Wallets' white uppercase />
              </NavLink>
            </li>
            <NavItem href='https://blockchain.info/charts' target='_blank'>
              <Text id='components.layouts.landing.header.charts' text='Charts' white uppercase />
            </NavItem>
            <NavItem href='https://blockchain.info/stats' target='_blank'>
              <Text id='components.layouts.landing.header.stats' text='Stats' white uppercase />
            </NavItem>
            <NavItem href='https://blockchain.info/markets' target='_blank'>
              <Text id='components.layouts.landing.header.markets' text='Markets' white uppercase />
            </NavItem>
            <NavItem href='https://blockchain.info/api'target='_blank'>
              <Text id='components.layouts.landing.header.api' text='Api' white uppercase />
            </NavItem>
          </Nav>
          <Nav pullRight>
            <li>
              <NavLink to='/login'>
                <PrimaryButton id='components.layouts.landing.header.login' text='Log in' light uppercase bordered rounded />
              </NavLink>
            </li>
            <li>
              <NavLink to='/register'>
                <SecondaryButton id='components.layouts.landing.header.signup' text='Sign up' light uppercase rounded />
              </NavLink>
            </li>
          </Nav>
        </NavbarCollapse>
      </Navbar>
    </NavbarWrapper>
  )
}

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default Header
