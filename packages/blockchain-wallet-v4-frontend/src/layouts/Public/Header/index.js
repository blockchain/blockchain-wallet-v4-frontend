import React from 'react'

import { Image, Link } from 'blockchain-info-components'
import { Navbar, NavbarBrand } from 'components/Navbar'

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
