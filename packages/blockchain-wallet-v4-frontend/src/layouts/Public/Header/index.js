import React from 'react'

import styled from 'styled-components'
import Announcements from 'components/Announcements'
import { Image, Link } from 'blockchain-info-components'
import {
  Navbar,
  NavbarBrand,
  NavbarMenu,
  NavbarNav,
  NavbarNavItem
} from 'components/Navbar'
import media from 'services/ResponsiveService'
import LoginOrCreate from './LoginOrCreate'

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
              <Image name='blockchain-vector' height='20px' />
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
