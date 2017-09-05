import React from 'react'
import { NavLink } from 'react-router-dom'

import { Image } from 'blockchain-info-components'
import { Navbar, NavbarBrand } from 'components/Navbar'

const Header = () => {
  return (
    <Navbar height='60px' fluid>
      <NavbarBrand>
        <NavLink to='/'>
          <Image name='blockchain-vector' height='20px' />
        </NavLink>
      </NavbarBrand>
    </Navbar>
  )
}

export default Header
