import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'
import logo from 'img/blockchain-vector.svg'

const Header = () => {
  return (
    <div className='container'>
      <div className='row'>
        <header styleName='header'>
          <NavLink styleName='link' to='/'><img src={logo} className={style.logo} /></NavLink>
          <NavLink styleName='link' to='/wallet'>Wallet</NavLink>
          <a styleName='link' href='https://blockchain.info/charts'>Charts</a>
          <a styleName='link' href='https://blockchain.info/stats'>Stats</a>
          <a styleName='link' href='https://blockchain.info/markets'>Markets</a>
          <a styleName='link' href='https://blockchain.info/api'>API</a>
        </header>
      </div>
    </div>

  )
}

export default CSSModules(Header, style)
