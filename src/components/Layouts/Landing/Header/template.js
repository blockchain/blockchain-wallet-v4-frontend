import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import * as ReactRouterDom from 'react-router-dom'

import logo from 'img/blockchain-vector.svg'
import { CircleButton } from 'components/Shared/Button'
import { Container } from 'components/Shared/Grid'
import { NavLink, Link } from 'components/Shared/Link'
import { Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem } from 'components/Shared/Navbar'
import { Text } from 'components/Shared/Text'

const NavbarWrapper = styled.div`
  background-color: #004A7C;
`
const NavbarLogo = styled.img.attrs({
  src: logo
})`
  height: 22px;
  margin-bottom 3px;
  border: none;
`
const NavbarItem = styled(NavItem)`
  padding: 0 10px;
`
const NavbarToggleButton = styled(NavbarToggler)`
  background-color: #FFFFFF;
  cursor: pointer;
`

const Header = (props) => {
  return (
    <NavbarWrapper>
      <Container>
        <Navbar light toggleable>
          <NavbarBrand href='/'>
            <NavbarLogo />
          </NavbarBrand>
          <Collapse navbar isOpen={props.headerMenuDisplayed}>
            <Nav navbar>
              <NavbarItem>
                <NavLink to='/wallet' id='components.layouts.landing.header.wallets' text='Wallets' white uppercase />
              </NavbarItem>
              <NavbarItem>
                <Link href='https://blockchain.info/charts' target='_blank' id='components.layouts.landing.header.charts' text='Charts' white uppercase />
              </NavbarItem>
              <NavbarItem>
                <Link href='https://blockchain.info/stats' target='_blank' id='components.layouts.landing.header.stats' text='Stats' white uppercase />
              </NavbarItem>
              <NavbarItem>
                <Link href='https://blockchain.info/markets' target='_blank' id='components.layouts.landing.header.markets' text='Markets' white uppercase />
              </NavbarItem>
              <NavbarItem>
                <Link href='https://blockchain.info/api' target='_blank' id='components.layouts.landing.header.api' text='Api' white uppercase />
              </NavbarItem>
            </Nav>
          </Collapse>
          <ReactRouterDom.NavLink to='/login'>
            <CircleButton type='primary'>
              <Text id='components.layouts.landing.header.login' text='Login' />
            </CircleButton>
          </ReactRouterDom.NavLink>
          <ReactRouterDom.NavLink to='/register'>
            <CircleButton type='primary'>
              <Text id='components.layouts.landing.header.signup' text='Sign up' />
            </CircleButton>
          </ReactRouterDom.NavLink>
          <NavbarToggleButton right onClick={props.clickHeaderMenu} />
        </Navbar>
      </Container>
    </NavbarWrapper>
  )
}

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default Header
