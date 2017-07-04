import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import Ticker from './Ticker'
import ExploreMenu from './ExploreMenu'
import Logout from './Logout'

import logo from 'img/blockchain-vector.svg'

const Header = (props) => {
  return (
    <nav className='navbar navbar-toggleable-md'>
      <button className={`navbar-toggler navbar-toggler-right navbar-light ${props.headerMenuDisplayed ? 'collapsed' : ''}`} onClick={props.clickHeaderMenu}>
        <span className='navbar-toggler-icon' />
      </button>
      <NavLink className='navbar-brand' to='/'>
        <img src={logo} />
      </NavLink>
      <div className={`collapse navbar-collapse ${props.headerMenuDisplayed ? 'show' : ''}`} id='navbarNav'>
        <ul className='navbar-nav ml-auto'>
          <Ticker />
          <ExploreMenu />
          <Logout />
        </ul>
      </div>
    </nav>
  )
}

Header.propTypes = {
  clickHeaderMenu: PropTypes.func.isRequired,
  headerMenuDisplayed: PropTypes.bool.isRequired
}

export default Header
