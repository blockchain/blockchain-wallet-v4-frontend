import React from 'react'
import PropTypes from 'prop-types'

import logo from 'img/blockchain-vector.svg'
import './style.scss'

import Ticker from './Ticker'
import WhatsNew from './WhatsNew'

const Header = (props) => {
  return (
    <nav className='navbar navbar-default'>
      <div className='container-fluid'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar' />
            <span className='icon-bar' />
            <span className='icon-bar' />
          </button>
          <a className='navbar-brand' href='#'>
            <img src={logo} />
          </a>
        </div>
        <ul className='nav navbar-nav navbar-right'>
          <li className={(props.exploreMenuDisplayed ? 'dropdown open' : 'dropdown')}>
            <a href='#' className='dropdown-toggle' onClick={props.clickExploreMenu}>
              <span>Explore</span>
              <i className='ti-angle-down mlm' />
            </a>
            <ul className='dropdown-menu'>
              <li><a href='#'>Home</a></li>
              <li><a href='#'>Charts</a></li>
              <li><a href='#'>Stats</a></li>
              <li><a href='#'>Markets</a></li>
              <li><a href='#'>API</a></li>
            </ul>
          </li>
          <li><a href='#'><span>Sign out</span></a></li>
        </ul>
        {/*<Ticker />*/}
        {/*<WhatsNew />*/}
      </div>
    </nav>
  )
}

Header.propTypes = {
  exploreMenuDisplayed: PropTypes.bool.isRequired,
  clickExploreMenu: PropTypes.func.isRequired
}

export default Header
