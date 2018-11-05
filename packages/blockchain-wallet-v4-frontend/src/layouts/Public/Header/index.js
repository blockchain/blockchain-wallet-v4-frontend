import React from 'react'

import ServiceAnnouncement from 'components/ServiceAnnouncement'
import { Image, Link } from 'blockchain-info-components'
import { Navbar, NavbarBrand } from 'components/Navbar'

const Header = () => {
  return (
    <React.Fragment>
      <ServiceAnnouncement alertArea='public' />
      <Navbar height='90px'>
        <NavbarBrand>
          <Link href='https://www.blockchain.com'>
            <Image name='blockchain-vector' height='20px' />
          </Link>
        </NavbarBrand>
      </Navbar>
    </React.Fragment>
  )
}

export default Header
