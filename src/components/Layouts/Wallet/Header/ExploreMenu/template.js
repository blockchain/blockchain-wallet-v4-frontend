import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'

import style from './style.scss'

const ExploreMenu = (props) => {
  return (
    <li className={`nav-item dropdown ${props.exploreMenuDisplayed ? 'show' : ''}`}>
      <a className='nav-link dropdown-toggle' id='navbarDropdownMenuLink' onClick={props.clickExploreMenu}>
        <Translate translate='EXPLORE' />
      </a>
      <div className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded={(props.exploreMenuDisplayed ? 'true' : 'false')}>
        <a className='dropdown-item' href='https://blockchain.info/'>
          <Translate translate='HOME' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/charts'>
          <Translate translate='CHARTS' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/stats'>
          <Translate translate='STATS' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/markets'>
          <Translate translate='MARKETS' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/api'>
          <Translate translate='API' />
        </a>
      </div>
    </li>
  )
}

ExploreMenu.propTypes = {
  exploreMenuDisplayed: PropTypes.bool.isRequired,
  clickExploreMenu: PropTypes.func.isRequired
}

export default CSSModules(ExploreMenu, style)
