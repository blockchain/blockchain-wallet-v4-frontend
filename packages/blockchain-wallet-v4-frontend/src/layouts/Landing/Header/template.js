import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { Button, Image, Link } from 'blockchain-info-components'
import { Navbar, NavbarBrand, NavbarHeader, NavbarMenu, NavbarNav, NavbarNavItem, NavbarToggler } from 'components/Navbar'

const ButtonNav = styled(NavbarNav)`
  flex-direction: row;
  width: 340px;
  margin: 0 auto;
  @media(min-width: 768px) and (max-width: 992px) { display: none; }
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
            <NavLink to='/wallet'>
              <FormattedMessage id='layouts.landing.header.wallets' defaultMessage='Wallets' />
            </NavLink>
          </NavbarNavItem>
          <NavbarNavItem>
            <Link href='https://blockchain.info/charts' target='_blank'>
              <FormattedMessage id='layouts.landing.header.charts' defaultMessage='Charts' />
            </Link>
          </NavbarNavItem>
          <NavbarNavItem>
            <Link href='https://blockchain.info/stats' target='_blank'>
              <FormattedMessage id='layouts.landing.header.stats' defaultMessage='Stats' />
            </Link>
          </NavbarNavItem>
          <NavbarNavItem>
            <Link href='https://blockchain.info/markets' target='_blank'>
              <FormattedMessage id='layouts.landing.header.markets' defaultMessage='Markets' />
            </Link>
          </NavbarNavItem>
          <NavbarNavItem>
            <Link href='https://blockchain.info/api' target='_blank'>
              <FormattedMessage id='layouts.landing.header.api' defaultMessage='Api' />
            </Link>
          </NavbarNavItem>
        </NavbarNav>
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
