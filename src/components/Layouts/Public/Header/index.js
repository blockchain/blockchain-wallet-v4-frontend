import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'
import logo from 'img/blockchain-vector.svg'

const Header = () => {
  return (
    <header styleName='header'>
      <NavLink to='/'>
        <img src={logo} styleName='logo' />
      </NavLink>
    </header>
  )
}

export default CSSModules(Header, style)
