import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import { FormattedMessage } from 'react-intl'

import style from './style.scss'
import logo from 'img/blockchain-vector.svg'

const Header = (props) => {
  return (
    <header styleName='header'>
      <div className='container'>
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
                <NavLink className='nav-link' to='/wallet'>
                  <FormattedMessage id='components.layouts.landing.header.wallets' />
                  <Translate translate='WALLETS' />
                </NavLink>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/charts'>
                  <Translate translate='CHARTS' />
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/stats'>
                  <Translate translate='STATS' />
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/markets'>
                  <Translate translate='MARKETS' />
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/api'>
                  <Translate translate='API' />
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  )
}

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default CSSModules(Header, style)
