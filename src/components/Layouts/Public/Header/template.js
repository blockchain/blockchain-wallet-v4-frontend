import React from 'react'
import { NavLink } from 'react-router-dom'

import logo from 'img/blockchain-vector.svg'

const Header = (props) => {
  return (
    <header>
      <div className='container'>
        <nav className='navbar'>
          <NavLink className='navbar-brand' to='/'>
            <img src={logo} />
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
