import React from 'react'
import { NavLink } from 'react-router-dom'

import style from './style.scss'
import link from 'sass/elements/link.scss'
import logo from 'img/blockchain-vector.svg'

const Header = () => {
  return (
    <header className={style.header}>
      <NavLink className={`${link.navigationUppercase} ${style.link}`} to='/'>
        <img src={logo} className={style.logo} />
      </NavLink>
      <NavLink className={`${link.navigationUppercase} ${style.link}`} to='/wallet'>Wallet</NavLink>
      <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/charts'>Charts</a>
      <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/stats'>Stats</a>
      <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/markets'>Markets</a>
      <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/api'>API</a>
    </header>
  )
}

export default Header
