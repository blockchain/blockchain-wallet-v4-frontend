import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarDivider,
  NavbarHeader,
  NavbarMenu,
  NavbarNav
} from 'components/Navbar'

import Features from './Features'
import Refresh from './Refresh'
import SecurityCenter from './SecurityCenter'
import Settings from './Settings'

type Props = {
  handleToggle: () => void
}

const BlockchainLogoImage = styled(Image)`
  display: block;
  height: 20px;
  margin-left: 0;
`
const NavbarStyled = styled(Navbar)`
  background-color: ${props => props.theme.grey900};
`

const Large: React.FC<Props> = props => {
  return (
    <NavbarStyled height='60px'>
      <NavbarHeader>
        <NavbarBrand>
          <NavLink to='/home' data-e2e='homeLink'>
            <BlockchainLogoImage name='blockchain-logo' />
          </NavLink>
        </NavbarBrand>
      </NavbarHeader>
      <NavbarMenu>
        <NavbarNav>
          <Features />
        </NavbarNav>
        <NavbarNav>
          <SecurityCenter />
          <NavbarDivider />
          <Refresh />
          <NavbarDivider />
          <Settings {...props} />
        </NavbarNav>
      </NavbarMenu>
    </NavbarStyled>
  )
}

export default Large
