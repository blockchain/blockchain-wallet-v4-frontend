import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import Ticker from './Ticker'
import ExploreMenu from './ExploreMenu'
import Logout from './Logout'

import logo from 'img/blockchain-vector.svg'
import style from './style.scss'

const Header = () => {
  return (
    <header styleName='header'>
      <NavLink to='/'>
        <img src={logo} styleName='logo' />
      </NavLink>
      <div styleName='right'>
        <Ticker />
        <ExploreMenu />
        <Logout />
      </div>
    </header>
  )
}

export default CSSModules(Header, style)
