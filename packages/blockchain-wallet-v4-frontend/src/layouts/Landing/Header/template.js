import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { Button, HoverDropdown, Image, Link } from 'blockchain-info-components'
import { Navbar, NavbarBrand, NavbarHeader, NavbarMenu, NavbarNav, NavbarNavItem, NavbarToggler } from 'components/Navbar'

const ButtonNav = styled(NavbarNav)`
  flex-direction: row;
  width: 340px;
  margin: 0 auto;
  @media(min-width: 768px) and (max-width: 992px) { display: none; }
`

const SearchBar = styled(NavbarNav)`
  background-color: white;
  width: 180px;
  height: 25px;
`

const Header = (props) => {
  const { toggled, handleToggle } = props

  return (
    <Navbar height='90px' fluid>
      <NavbarHeader>
        <NavbarBrand>
          <NavLink to='/'>
            <Image name='blockchain-vector' height='20px' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenu toggled={toggled}>
        <NavbarNav>
          <NavbarNavItem>
            <HoverDropdown>
              <NavLink to='/wallet'>
                <FormattedMessage id='layouts.landing.header.wallet' defaultMessage='Wallet' />
              </NavLink>
              <Link href='https://blockchain.info/charts'>
                <FormattedMessage id='layouts.landing.header.charts' defaultMessage='Charts' />
              </Link>
              <Link href='https://blockchain.info/stats'>
                <FormattedMessage id='layouts.landing.header.stats' defaultMessage='Stats' />
              </Link>
              <Link href='https://blockchain.info/markets'>
                <FormattedMessage id='layouts.landing.header.markets' defaultMessage='Markets' />
              </Link>
            </HoverDropdown>
          </NavbarNavItem>
          <NavbarNavItem>
            <Link href='https://blockchain.info/' target='_blank'>
              <FormattedMessage id='layouts.landing.header.data' defaultMessage='Data' />
            </Link>
          </NavbarNavItem>
          <NavbarNavItem>
            <Link href='https://blockchain.info/api' target='_blank'>
              <FormattedMessage id='layouts.landing.header.api' defaultMessage='API' />
            </Link>
          </NavbarNavItem>
          <NavbarNavItem>
            <Link href='https://blockchain.info/about' target='_blank'>
              <FormattedMessage id='layouts.landing.header.about' defaultMessage='About' />
            </Link>
          </NavbarNavItem>
        </NavbarNav>
        <SearchBar />
        <ButtonNav>
          <NavbarNavItem>
            <NavLink to='/login'>
              <Button nature='primary' uppercase rounded>
                <FormattedMessage id='layouts.landing.header.login' defaultMessage='Log in' />
              </Button>
            </NavLink>
          </NavbarNavItem>
          <NavbarNavItem>
            <NavLink to='/register'>
              <Button nature='secondary' uppercase rounded>
                <FormattedMessage id='layouts.landing.header.signup' defaultMessage='Sign up' />
              </Button>
            </NavLink>
          </NavbarNavItem>
        </ButtonNav>
      </NavbarMenu>
      <NavbarToggler onToggle={handleToggle} />
    </Navbar>
  )
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  toggled: PropTypes.bool.isRequired
}

export default Header
