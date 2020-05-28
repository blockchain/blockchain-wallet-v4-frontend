import { Icon, Image } from 'blockchain-info-components'
import { NavLink } from 'react-router-dom'
import React from 'react'
import styled from 'styled-components'

import {
  Navbar,
  NavbarBrand,
  NavbarDivider,
  NavbarHeader,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'
import Balances from '../MenuLeft/Balances'
import Features from './Features'
import media from 'services/ResponsiveService'
import Refresh from './Refresh'
import SecurityCenter from './SecurityCenter'
import Settings from './Settings'

import { Props as OwnProps } from '.'

type Props = {
  handleToggle: () => void
} & OwnProps

const Spacer = styled.div``

const NavbarContainer = styled.div`
  background-color: ${props => props.theme.grey900};
`

const BlockchainLogoImage = styled(Image)`
  display: block;
  height: 20px;
  width: 160px;
  ${media.tablet`
    margin-left: 12px;
  `}
`

const NavbarStyled = styled(Navbar)`
  width: auto;
  margin: 0 26px;
`

const NavbarBottomStyled = styled(NavbarStyled)`
  display: flex;
  box-sizing: border-box;
  border-top: 1px solid ${props => props.theme.whiteFade100};
  ${media.tablet`
    margin: 0;
    padding: 0 15px;
    width: 100%;
  `}
`

const Medium: React.FC<Props> = props => {
  return (
    <NavbarContainer>
      <NavbarStyled>
        <NavbarHeader>
          <NavbarBrand>
            <Icon
              name='hamburger-menu'
              color='whiteFade600'
              size='16px'
              onClick={props.handleToggle}
            />
            <NavLink to='/home' data-e2e='homeLink'>
              <BlockchainLogoImage name='blockchain-logo' />
            </NavLink>
          </NavbarBrand>
        </NavbarHeader>
        <NavbarMenu>
          <Spacer />
          <NavbarNav>
            <NavbarNavItem>
              <SecurityCenter />
            </NavbarNavItem>
            <NavbarDivider />
            <NavbarNavItem>
              <Refresh />
            </NavbarNavItem>
            <NavbarDivider />
            <NavbarNavItem>
              <Settings {...props} />
            </NavbarNavItem>
          </NavbarNav>
        </NavbarMenu>
      </NavbarStyled>
      <NavbarBottomStyled height='60px'>
        <Balances />
        <NavbarMenu>
          <NavbarNav>
            <Features />
          </NavbarNav>
        </NavbarMenu>
      </NavbarBottomStyled>
    </NavbarContainer>
  )
}

export default Medium
