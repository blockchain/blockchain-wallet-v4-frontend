import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'
import logo from 'img/blockchain-vector.svg'

const Header = (props) => {
  return (
    <div className='container' styleName='header'>
      <nav className='navbar navbar-toggleable-md'>
        <button className={`navbar-toggler navbar-toggler-right navbar-light ${props.headerMenuDisplayed ? 'collapsed' : ''}`} onClick={props.clickHeaderMenu}>
          <span className='navbar-toggler-icon' />
        </button>
        <NavLink className='navbar-brand' to='/'>
          <img src={logo} className={style.logo} />
        </NavLink>
        <div className={`collapse navbar-collapse ${props.headerMenuDisplayed ? 'show' : ''}`} id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item active'>
              <NavLink className='nav-link' to='/wallet'>Wallet</NavLink>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='https://blockchain.info/charts'>Charts</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='https://blockchain.info/stats'>Stats</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='https://blockchain.info/markets'>Markets</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href='https://blockchain.info/api'>API</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default CSSModules(Header, style)
