import React from 'react'
import PropTypes from 'prop-types'

import style from './style.scss'

const ExploreMenu = (props) => {
  return (
    <nav className={style.dropdown}>
      <div className={(props.exploreMenuDisplayed ? style.dropdownOpened : style.dropdownClosed)}>
        <a onClick={props.clickExploreMenu} className={style.link}>
          <span>Explore</span>
          <i className='ti-angle-down mlm' />
        </a>
        <ul className={(props.exploreMenuDisplayed ? style.menuOpened : style.menuClosed)}>
          <li><a href='https://blockchain.info/'>Home</a></li>
          <li><a href='https://blockchain.info/charts'>Charts</a></li>
          <li><a href='https://blockchain.info/stats'>Stats</a></li>
          <li><a href='https://blockchain.info/markets'>Markets</a></li>
          <li><a href='https://blockchain.info/api'>API</a></li>
        </ul>
      </div>
    </nav>
  )
}

ExploreMenu.propTypes = {
  exploreMenuDisplayed: PropTypes.bool.isRequired,
  clickExploreMenu: PropTypes.func.isRequired
}

export default ExploreMenu
