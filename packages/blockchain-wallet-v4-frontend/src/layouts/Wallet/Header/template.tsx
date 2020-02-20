import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import { Icon, Image } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'
import Announcements from 'components/Announcements'
import FaqIcon from './FaqIcon'
import media, { isMobile, useMedia } from 'services/ResponsiveService'
import RefreshIcon from './RefreshIcon'
import SecurityCenter from './SecurityCenter'
import SendRequest from './SendRequest'
import Settings from './Settings'
import WhatsNewIcon from './WhatsNewIcon'

const BlockchainLogoImage = styled(Image)`
  width: 200px;
  display: block;
  height: 20px;
  margin-left: 0;
  ${media.tablet`
    width: 160px;
    margin-left: 6px;
  `}
`
const NavbarNavItemSpacer = styled(NavbarNavItem)`
  margin-right: 12px;
  ${media.tablet`
    margin-right: 8px;
  `}
`
const NavbarNavItemWithText = styled(NavbarNavItem)`
  padding: 0 26px;
  margin: 0;
  border-left: 1px solid ${props => props.theme.whiteFade400};
  &:last-child {
    padding-right: 0;
  }
  ${media.tablet`
    padding: 0px;
    border-left: 0px;
    margin-right: 8px;
  `}
`
const NavbarStyled = styled(Navbar)`
  background-color: ${props => props.theme.grey900};
`
const NavbarMenuStyled = styled(NavbarMenu)`
  width: 100%;
  margin-left: 42px;
  ${media.tablet`
    margin-left: 16px;
    overflow-x: scroll;
  `}
`

const Header = props => {
  const isTabletL = useMedia('tabletL')

  const { handleToggle, ...rest } = props

  return (
    <>
      <NavbarStyled height='60px'>
        <NavbarHeader>
          <NavbarBrand>
            <Icon
              name='hamburger-menu'
              color='whiteFade600'
              size='16px'
              onClick={handleToggle}
            />
            <NavLink to='/home' data-e2e='homeLink'>
              <BlockchainLogoImage name='blockchain-logo' />
            </NavLink>
          </NavbarBrand>
        </NavbarHeader>
        <NavbarMenuStyled>
          <SendRequest />
          {!isTabletL && (
            <NavbarNav>
              <NavbarNavItem>
                <WhatsNewIcon />
              </NavbarNavItem>
              <NavbarNavItem>
                <RefreshIcon />
              </NavbarNavItem>
              <NavbarNavItemSpacer>
                <FaqIcon />
              </NavbarNavItemSpacer>
              <NavbarNavItemWithText>
                <SecurityCenter {...rest} />
              </NavbarNavItemWithText>
              <NavbarNavItemWithText>
                <Settings {...rest} />
              </NavbarNavItemWithText>
            </NavbarNav>
          )}
        </NavbarMenuStyled>
      </NavbarStyled>
      <Announcements type='service' alertArea='wallet' />
      <Announcements type='static' />
    </>
  )
}

Header.propTypes = {
  handleToggle: PropTypes.func.isRequired
}

export default Header
