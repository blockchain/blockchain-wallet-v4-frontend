import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { Button, Image, Link, HoverDropdown, Navbar, NavbarBrand, NavbarHeader, NavbarMenu, NavbarNav, NavbarNavItem, NavbarToggler } from 'blockchain-info-components'

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
  @media(min-width: 768px) and (max-width: 800px) { display: none; }
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
          <HoverDropdown>
            <NavLink to='/wallet'>
              <FormattedMessage id='layouts.landing.header.wallet' defaultMessage='Wallet' />
            </NavLink>
            <Link href='https://blockchain.info/login' target='_blank'>
              <FormattedMessage id='layouts.landing.header.login' defaultMessage='Login' />
            </Link>
          </HoverDropdown>
          <HoverDropdown>
            <Link href='https://blockchain.info/' target='_blank'>
              <FormattedMessage id='layouts.landing.header.data' defaultMessage='Data' />
            </Link>
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
          <HoverDropdown>
            <Link href='https://blockchain.info/api' target='_blank'>
              <FormattedMessage id='layouts.landing.header.api' defaultMessage='API' />
            </Link>
            <Link href='https://blockchain.info/enterprise' target='_blank'>
              <FormattedMessage id='layouts.landing.header.business' defaultMessage='Business' />
            </Link>
          </HoverDropdown>
          <HoverDropdown>
            <Link href='https://blockchain.info/about' target='_blank'>
              <FormattedMessage id='layouts.landing.header.about' defaultMessage='About' />
            </Link>
            <Link href='https://blockchain.com/team' target='_blank'>
              <FormattedMessage id='layouts.landing.header.team' defaultMessage='Team' />
            </Link>
            <Link href='https://blockchain.com/careers' target='_blank'>
              <FormattedMessage id='layouts.landing.header.careers' defaultMessage='Careers' />
            </Link>
            <Link href='https://blockchain.com/press' target='_blank'>
              <FormattedMessage id='layouts.landing.header.press' defaultMessage='Press' />
            </Link>
            <Link href='https://blog.blockchain.com' target='_blank'>
              <FormattedMessage id='layouts.landing.header.blog' defaultMessage='Blog' />
            </Link>
          </HoverDropdown>
        </NavbarNav>
        <SearchBar />
        <ButtonNav>
          <NavbarNavItem>
            <NavLink to='/register'>
              <Button nature='primary' uppercase rounded>
                <FormattedMessage id='layouts.landing.header.signup' defaultMessage='Get a free wallet' />
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
