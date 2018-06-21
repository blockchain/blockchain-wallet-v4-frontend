import React from 'react'

import ServiceAnnouncement from 'components/ServiceAnnouncement'
import { Image, Link } from 'blockchain-info-components'
import { Navbar, NavbarBrand } from 'components/Navbar'

const Header = () => {
  return (
    <React.Fragment>
      <Navbar height='90px'>
        <NavbarBrand>
          <Link href='https://www.blockchain.com'>
            <Image name='blockchain-vector' height='20px' />
          </Link>
        </NavbarBrand>
      </Navbar>
      <ServiceAnnouncement type='public' />
    </React.Fragment>
  )
}

export default Header
