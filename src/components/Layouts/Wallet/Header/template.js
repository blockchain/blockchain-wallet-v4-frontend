import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Ticker from './Ticker'
import ExploreMenu from './ExploreMenu'
import WhatsNew from './WhatsNew'
import Refresh from './Refresh'
import Logout from './Logout'

import logo from 'img/blockchain-vector.svg'

const Header = (props) => (
  <div className='wallet-top-navigation navbar navbar-inverse mbn'>
    <div className='bc-header'>
      <div className='container-fluid'>
        <div className='navbar-header flex-between flex-center'>
          <button className={`navbar-toggle ${props.headerMenuDisplayed ? 'collapsed' : ''}`} onClick={props.clickHeaderMenu}>
            <span className='ti-menu white' />
          </button>
          <NavLink className='navbar-brand' to='/'>
            <img id='logo' src={logo} />
          </NavLink>
        </div>
        <div className={`navbar-collapse collapse ${props.headerMenuDisplayed ? 'show' : ''}`} id='navbarNav'>
          <ul className='nav navbar-nav navbar-right'>
            <Ticker />
            <ExploreMenu />
            <WhatsNew />
            <Refresh />
            <Logout />
          </ul>
        </div>
      </div>
    </div>
  </div>
)

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default Header
