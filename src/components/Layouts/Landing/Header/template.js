import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import logo from 'img/blockchain-vector.svg'
import { Navbar, NavbarBrand, NavbarHeader, NavbarToggle, NavbarCollapse, Nav, NavItem,
  PrimaryButton, RouterLink, SecondaryButton, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding-top: 17px;
  padding-left: 15px;
  padding-right: 15px;
  & .navbar-header { height: 60px; }
  & .navbar-right {
    & > li { padding-top: 0; }
    @media (min-width: 768px) and (max-width: 1200px) { display: none; } 
  }
`
const Logo = styled.img.attrs({
  src: logo
})`
  display: block;
  height: 22px;
  margin: 15px;
`
const Header = (props) => {
  const { toggled, handleToggle } = props

  return (
    <Wrapper>
      <Navbar inverse defaultExpanded={toggled}>
        <NavbarHeader>
          <NavbarBrand>
            <RouterLink to='/'><Logo /></RouterLink>
          </NavbarBrand>
          <NavbarToggle onClick={handleToggle} />
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
    </Wrapper>
  )
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default Header
