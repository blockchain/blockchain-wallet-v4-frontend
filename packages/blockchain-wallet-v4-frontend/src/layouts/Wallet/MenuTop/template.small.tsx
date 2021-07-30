import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Icon, Image } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarDivider,
  NavbarHeader,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'

import Balances from '../MenuLeft/Balances'
import { Props as OwnProps } from '.'
import Features from './Features'
import Refresh from './Refresh'
import SecurityCenter from './SecurityCenter'
import Settings from './Settings'

type Props = {
  handleToggle: () => void
} & OwnProps

const Spacer = styled.div``

const NavbarContainer = styled.div`
  width: auto;
  padding: 0 16px;
  background-color: ${(props) => props.theme.grey900};
`

const BlockchainLogoImage = styled(Image)`
  display: block;
  height: 20px;
  width: 160px;
`

const NavbarBottomStyled = styled(Navbar)`
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  border-top: 1px solid ${(props) => props.theme.whiteFade100};
`

const HamburgerIcon = styled(Icon)`
  margin-right: 16px;
`

const Small: React.FC<Props> = (props) => {
  return (
    <NavbarContainer>
      <Navbar height='60px'>
        <NavbarHeader>
          <NavbarBrand>
            <NavLink to='/home' data-e2e='homeLink'>
              <BlockchainLogoImage name='blockchain-logo' />
            </NavLink>
          </NavbarBrand>
        </NavbarHeader>
        <Spacer />
        <NavbarNav>
          <SecurityCenter />
          <Refresh />
          <Settings {...props} />
        </NavbarNav>
      </Navbar>
      <NavbarBottomStyled height='60px'>
        <NavbarNav>
          <NavbarNavItem>
            <HamburgerIcon
              name='hamburger-menu'
              color='alwaysWhite'
              size='16px'
              onClick={props.handleToggle}
            />
          </NavbarNavItem>
          <NavbarDivider />
          <NavbarNavItem>
            <Balances />
          </NavbarNavItem>
        </NavbarNav>
        <NavbarNav>
          <NavbarNavItem>
            <Features />
          </NavbarNavItem>
        </NavbarNav>
      </NavbarBottomStyled>
    </NavbarContainer>
  )
}

export default Small
