import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import logo from 'img/blockchain-vector.svg'
import { PrimaryButton, SecondaryButton } from 'components/generic/Button'
import { RouterLink } from 'components/generic/Link'
import { Text } from 'components/generic/Text'
import { Navbar, NavbarBrand, NavbarHeader, NavbarToggle, NavbarCollapse, Nav, NavItem } from 'components/generic/Navbar'

const NavbarWrapper = styled.div`
  padding-top: 17px;
  
  & .navbar-header {  height: 50px; }

  & .navbar-right {

    & > li { padding-top:0; }

    @media (min-width: 768px) and (max-width: 1200px) { display: none; } 
  }
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
      <Navbar inverse defaultExpanded={props.headerMenuDisplayed}>
        <NavbarHeader>
          <NavbarBrand>
            <RouterLink to='/'><NavbarLogo /></RouterLink>
          </NavbarBrand>
          <NavbarToggle onClick={props.clickHeaderMenu} />
        </NavbarHeader>
        <NavbarCollapse>
          <Nav>
            <RouterLink to='/wallet'>
              <NavItem>
                <Text id='components.layouts.landing.header.wallets' text='Wallets' white uppercase />
              </NavItem>
            </RouterLink>
            <NavItem href='https://blockchain.info/charts' target='_blank'>
              <Text id='components.layouts.landing.header.charts' text='Charts' white uppercase />
            </NavItem>
            <NavItem href='https://blockchain.info/stats' target='_blank'>
              <Text id='components.layouts.landing.header.stats' text='Stats' white uppercase />
            </NavItem>
            <NavItem href='https://blockchain.info/markets' target='_blank'>
              <Text id='components.layouts.landing.header.markets' text='Markets' white uppercase />
            </NavItem>
            <NavItem href='https://blockchain.info/api' target='_blank'>
              <Text id='components.layouts.landing.header.api' text='Api' white uppercase />
            </NavItem>
          </Nav>
          <Nav pullRight>
            <RouterLink to='/login'>
              <NavItem>
                <PrimaryButton rounded bordered>
                  <Text id='components.layouts.landing.header.login' text='Log in' light uppercase white />
                </PrimaryButton>
              </NavItem>
            </RouterLink>
            <RouterLink to='/register'>
              <NavItem>
                <SecondaryButton rounded>
                  <Text id='components.layouts.landing.header.signup' text='Sign up' light uppercase white />
                </SecondaryButton>
              </NavItem>
            </RouterLink>
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
