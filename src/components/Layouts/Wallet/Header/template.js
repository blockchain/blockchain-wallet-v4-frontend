import React from 'react'
import { NavLink } from 'react-router-dom'

import ExploreMenu from './ExploreMenu'

import logo from 'img/blockchain-vector.svg'
import style from './style.scss'

const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.left}>
        <NavLink to='/'>
          <img src={logo} className={style.logo} />
        </NavLink>
      </div>
      <div className={style.right}>
        <ExploreMenu />
        <a className={style.link}>Sign out</a>
      </div>
    </header>
  )
}

export default Header
