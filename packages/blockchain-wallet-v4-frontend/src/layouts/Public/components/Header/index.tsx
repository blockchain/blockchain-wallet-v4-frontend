import React from 'react'
import styled from 'styled-components'

import { Image, Link } from 'blockchain-info-components'
import Announcements from 'components/Announcements'
import { Navbar, NavbarBrand } from 'components/Navbar'
import { media } from 'services/styles'

const NavbarStyled = styled(Navbar)`
  padding: 0 16px;
  box-sizing: border-box;
  background-color: ${props => props.theme.grey900};
  background-image: url('/img/bg-pattern.svg');
`
const NavbarBrandStyled = styled(NavbarBrand)`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  padding-left: 0;
`

const BlockchainLogoImage = styled(Image)`
  width: 240px;
  display: block;
  ${media.tablet`
    width: 200px;
  `}
`
const PublicBrand = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const Header = () => (
  <>
    <NavbarStyled height='112px'>
      <NavbarBrandStyled>
        <PublicBrand>
          <Link href='https://www.blockchain.com'>
            <BlockchainLogoImage name='blockchain-logo' height='24px' />
          </Link>
        </PublicBrand>
      </NavbarBrandStyled>
    </NavbarStyled>
    <Announcements type='service' alertArea='public' />
  </>
)

export default Header
