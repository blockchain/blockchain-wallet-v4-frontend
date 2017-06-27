import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

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
                  <FormattedMessage
                    id='components.layouts.landing.header.wallets'
                    defaultMessage='Wallets'
                  />
                </NavLink>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/charts'>
                  <FormattedMessage id='components.layouts.landing.header.charts' defaultMessage='Charts' />
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/stats'>
                  <FormattedMessage id='components.layouts.landing.header.stats' defaultMessage='Stats' />
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/markets'>
                  <FormattedMessage id='components.layouts.landing.header.markets' defaultMessage='Markets' />
                </a>
              </li>
              <li className='nav-item'>
                <a className='nav-link' href='https://blockchain.info/api'>
                  <FormattedMessage id='components.layouts.landing.header.api' defaultMessage='Api' />
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
