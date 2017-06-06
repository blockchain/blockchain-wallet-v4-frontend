import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'

import style from './style.scss'
import link from 'sass/elements/link.scss'
import grid from 'sass/elements/grid.scss'
import logo from 'img/blockchain-vector.svg'

const Header = () => {
  return (
    <div className={grid.container}>
      <div className={grid.row}>
        <header className={style.header}>
          <NavLink className={classNames(link.navigationUppercase, style.link)} to='/'><img src={logo} className={style.logo} /></NavLink>
          <NavLink className={classNames(link.navigationUppercase, style.link)} to='/wallet'>Wallet</NavLink>
          <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/charts'>Charts</a>
          <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/stats'>Stats</a>
          <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/markets'>Markets</a>
          <a className={`${link.navigationUppercase} ${style.link}`} href='https://blockchain.info/api'>API</a>
        </header>
      </div>
    </div>

  )
}

export default Header
