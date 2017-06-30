import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { CircleButton } from 'components/Shared/Button'

const NavbarButtonContainer = styled.div`
  display: none;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 350px;
  white-space: nowrap;

  @media (min-width: 992px) { display: flex; }
`
const NavbarButtonMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  width: 40px;
  border-radius: 2px;
  padding: 5px;
  border-box: box-sizing;
  cursor: pointer;
  background-color: ${props => props.mobileDisplay ? props.theme.colors.blue.secondary : 'transparent'};

  @media (min-width: 768px) { display: none; }
`
const NavbarButtonMenuBar = styled.div`
  display: inline-flex;
  width: 30px;
  height: 2px;
  border-radius: 1px;
  background-color: ${props => props.theme.colors.white}
`
const NavbarContainer = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  width: 100%;
  
  @media (min-width: 544px) { width: 540px; margin: 0 auto; }
  @media (min-width: 768px) { width: 720px; }
  @media (min-width: 992px) { width: 960px; }
  @media (min-width: 1200px) { width: 1140px; }
`
const NavbarLink = styled.a`
  padding: 0 10px;
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.colors.white};
    text-decoration: none;
  }
  
  &:focus {
    color: ${props => props.theme.colors.white};
    text-decoration: none;
  }
`
const NavbarLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding-right: 20px;
`
const NavbarLinkRouter = styled(NavLink)`
  padding: 0 10px;
  color: ${props => props.theme.colors.white};
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 500;

  &:hover {
    color: ${props => props.theme.colors.white};
    text-decoration: none;
  }

  &:focus {
    color: ${props => props.theme.colors.white};
    text-decoration: none;
  }
`
const NavbarLogo = styled.div`
  display: inline-flex;
  height: 22px;
  width: 200px;
  background-image: url("./img/${props => props.theme.images.logo}");
  background-color: ${props => props.theme.colors.blue.primary};
  background-size: cover;
  border: none;
`
const NavbarMenu = styled.div`
  display: none;

  @media (min-width: 768px) { display: flex; }
`
const NavbarMenuItem = styled.div`
  color: ${props => props.theme.colors.white}
  cursor: pointer;
`
const NavbarWrapper = styled.header`
  width: 100%;
  height: 90px;
  background-color: ${props => props.theme.colors.blue.primary}
`

const Header = (props) => {
  return (
    <NavbarWrapper>
      <NavbarContainer>
        <NavbarLinkContainer>
          <NavbarLinkRouter to='/'>
            <NavbarLogo />
          </NavbarLinkRouter>
          <NavbarMenu mobileDisplay={props.headerMenuDisplayed}>
            <NavbarLinkRouter to='/wallet'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.wallets' defaultMessage='Wallets' />
              </NavbarMenuItem>
            </NavbarLinkRouter>
            <NavbarLink href='https://blockchain.info/charts'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.charts' defaultMessage='Charts' />
              </NavbarMenuItem>
            </NavbarLink>
            <NavbarLink href='https://blockchain.info/stats'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.stats' defaultMessage='Stats' />
              </NavbarMenuItem>
            </NavbarLink>
            <NavbarLink href='https://blockchain.info/markets'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.markets' defaultMessage='Markets' />
              </NavbarMenuItem>
            </NavbarLink>
            <NavbarLink href='https://blockchain.info/api'>
              <NavbarMenuItem>
                <FormattedMessage id='components.layouts.landing.header.api' defaultMessage='Api' />
              </NavbarMenuItem>
            </NavbarLink>
          </NavbarMenu>
        </NavbarLinkContainer>
        <NavbarButtonContainer>
          <CircleButton type='primary'>
            <NavbarLinkRouter to='/login'>
              <FormattedMessage id='components.layouts.landing.header.login' defaultMessage='Log in' />
            </NavbarLinkRouter>
          </CircleButton>
          <CircleButton type='secondary'>
            <NavbarLinkRouter to='/register'>
              <FormattedMessage id='components.layouts.landing.header.signup' defaultMessage='Sign up' />
            </NavbarLinkRouter>
          </CircleButton>
        </NavbarButtonContainer>
        <NavbarButtonMenu mobileDisplay={props.headerMenuDisplayed} onClick={props.clickHeaderMenu}>
          <NavbarButtonMenuBar />
          <NavbarButtonMenuBar />
          <NavbarButtonMenuBar />
        </NavbarButtonMenu>
      </NavbarContainer>
    </NavbarWrapper>
  )
}

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default Header
