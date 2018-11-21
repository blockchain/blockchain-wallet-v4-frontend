import React from 'react'

import Announcements from 'components/Announcements'
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
      <Announcements type='service' alertArea='public' />
    </React.Fragment>
  )
}

export default Header
