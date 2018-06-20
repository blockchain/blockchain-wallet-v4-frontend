import React from 'react'
import styled from 'styled-components'

import ServiceAnnouncement from 'components/ServiceAnnouncement'
import { Image, Link } from 'blockchain-info-components'
import { Navbar, NavbarBrand } from 'components/Navbar'

const AnnouncementWrapper = styled.div`
  margin: 0 auto 20px auto;
  width: 100%;
  
  @media (min-width: 992px) {
    width: 960px;
  }
  
  @media (min-width: 1200px) {
    width: 1140px;
  }
`

const Header = () => {
  return (
      <Navbar height='90px'>
        <NavbarBrand>
          <Link href='https://www.blockchain.com'>
            <Image name='blockchain-vector' height='20px' />
          </Link>
        </NavbarBrand>
      </Navbar>
  )
}

export default Header
