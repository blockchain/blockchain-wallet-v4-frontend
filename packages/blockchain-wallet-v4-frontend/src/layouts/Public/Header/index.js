import React from 'react'

import { Image, Link } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'
import Announcements from 'components/Announcements'
import LoginOrCreate from './LoginOrCreate'
import media from 'services/ResponsiveService'
import styled from 'styled-components'

const BlockchainLogoImage = styled(Image)`
  width: 200px;
  display: block;
  ${media.tablet`
    width: 160px;
  `}
`
const VersionWrapper = styled.div`
  margin-top: 4px;
`
const PublicBrand = styled.div`
  display: flex;
  flex-direction: column;
`
const PublicNavbarNavItem = styled(NavbarNavItem)`
  ${media.mobile`
    text-align: right;
  `}
`

const Header = () => {
  return (
    <React.Fragment>
      <Navbar height='90px'>
        <NavbarBrand>
          <PublicBrand>
            <Link href='https://www.blockchain.com'>
              <BlockchainLogoImage name='blockchain-logo' height='20px' />
            </Link>
            <VersionWrapper>
              <Link
                href='https://github.com/blockchain/blockchain-wallet-v4-frontend/releases'
                target='_blank'
                size='14px'
                weight={500}
                color='white'
              >
                Version {APP_VERSION}
              </Link>
            </VersionWrapper>
          </PublicBrand>
        </NavbarBrand>
        <NavbarMenu>
          <NavbarNav>
            <PublicNavbarNavItem>
              <LoginOrCreate />
            </PublicNavbarNavItem>
          </NavbarNav>
        </NavbarMenu>
      </Navbar>
      <Announcements type='service' alertArea='public' />
    </React.Fragment>
  )
}

export default Header
