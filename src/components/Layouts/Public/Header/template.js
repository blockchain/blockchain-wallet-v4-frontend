import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'
import logo from 'img/blockchain-vector.svg'

const Header = (props) => {
  return (
    <header>
      <div className='container'>
        <nav className='navbar'>
          <NavLink className='navbar-brand' to='/'>
            <img src={logo} className={style.logo} />
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default CSSModules(Header, style)
