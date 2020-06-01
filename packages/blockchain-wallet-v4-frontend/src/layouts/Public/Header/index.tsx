import React from 'react'

import { Image, Link } from 'blockchain-info-components'
import { Navbar, NavbarBrand } from 'components/Navbar'
import Announcements from 'components/Announcements'
import media from 'services/ResponsiveService'
import styled from 'styled-components'

const NavbarStyled = styled(Navbar)`
  background-color: ${props => props.theme.blue900};
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
  flex-direction: column;
`

const Header = () => (
  <React.Fragment>
    <NavbarStyled height='90px'>
      <NavbarBrand>
        <PublicBrand>
          <Link href='https://www.blockchain.com'>
            <BlockchainLogoImage name='blockchain-logo' height='24px' />
          </Link>
        </PublicBrand>
      </NavbarBrand>
    </NavbarStyled>
    <Announcements type='service' alertArea='public' />
  </React.Fragment>
)

export default Header
