import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import logo from 'img/blockchain-vector.svg'
import { Grid } from 'components/Shared/Grid'
import { Link, RouterLink } from 'components/Shared/Link'
import { Navbar, NavbarBrand, NavbarHeader, NavbarToggle, NavbarCollapse, Nav, NavItem } from 'components/Shared/Navbar'

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
const NavbarToggleButton = styled(NavbarToggle)`
  background-color: #FFFFFF;
  cursor: pointer;
`

const Header = (props) => {
  return (
    <NavbarWrapper>
      <Grid>
        <Navbar>
          <NavbarHeader>
            <NavbarBrand href='/'>
              <NavbarLogo />
            </NavbarBrand>
            <NavbarToggleButton onClick={props.clickHeaderMenu} />
          </NavbarHeader>
          {/*<NavbarCollapse isOpen={props.headerMenuDisplayed}>*/}
          <NavbarCollapse>
            <Nav>
              <NavbarItem>
                <RouterLink to='/wallet' id='components.layouts.landing.header.wallets' text='Wallets' white uppercase />
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
            <Nav pullRight />
          </NavbarCollapse>
        </Navbar>
      </Grid>
    </NavbarWrapper>
  )
}

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default Header
