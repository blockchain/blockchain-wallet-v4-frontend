import React from 'react'
import { NavLink } from 'react-router-dom'

import logo from 'img/blockchain-vector.svg'
import style from './style.scss'

const Header = () => {
  return (
    <header className={style.header}>
      <NavLink to='/'>
        <img src={logo} className={style.logo} />
      </NavLink>
    </header>
  )
}

export default Header
