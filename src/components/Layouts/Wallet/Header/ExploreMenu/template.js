import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const ExploreMenu = (props) => {
  return (
    <nav styleName={(props.exploreMenuDisplayed ? 'dropdown-opened' : 'dropdown-closed')}>
      <a onClick={props.clickExploreMenu} className='navigation'>
        Explore
        <i className='ti-angle-down margin-left-5' />
      </a>
      <div styleName={(props.exploreMenuDisplayed ? 'menu-opened' : 'menu-closed')}>
        <a className='navigation-sub' href='https://blockchain.info/'>Home</a>
        <a className='navigation-sub' href='https://blockchain.info/charts'>Charts</a>
        <a className='navigation-sub' href='https://blockchain.info/stats'>Stats</a>
        <a className='navigation-sub' href='https://blockchain.info/markets'>Markets</a>
        <a className='navigation-sub' href='https://blockchain.info/api'>API</a>
      </div>
    </nav>
  )
}

ExploreMenu.propTypes = {
  exploreMenuDisplayed: PropTypes.bool.isRequired,
  clickExploreMenu: PropTypes.func.isRequired
}

export default CSSModules(ExploreMenu, style)
