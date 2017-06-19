import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const ExploreMenu = (props) => {
  return (
    <li className={`nav-item dropdown ${props.exploreMenuDisplayed ? 'show' : ''}`}>
      <a className='nav-link dropdown-toggle' id='navbarDropdownMenuLink' onClick={props.clickExploreMenu}>
        Explore
      </a>
      <div className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded={(props.exploreMenuDisplayed ? 'true' : 'false')}>
        <a className='dropdown-item' href='https://blockchain.info/'>Home</a>
        <a className='dropdown-item' href='https://blockchain.info/charts'>Charts</a>
        <a className='dropdown-item' href='https://blockchain.info/stats'>Stats</a>
        <a className='dropdown-item' href='https://blockchain.info/markets'>Markets</a>
        <a className='dropdown-item' href='https://blockchain.info/api'>API</a>
      </div>
    </li>
  )
}

ExploreMenu.propTypes = {
  exploreMenuDisplayed: PropTypes.bool.isRequired,
  clickExploreMenu: PropTypes.func.isRequired
}

export default CSSModules(ExploreMenu, style)
