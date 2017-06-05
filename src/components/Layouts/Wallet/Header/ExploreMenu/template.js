import React from 'react'
import PropTypes from 'prop-types'

import style from './style.scss'
import link from 'sass/elements/link.scss'
import typography from 'sass/utilities/fonts.scss'

const ExploreMenu = (props) => {
  return (
    <nav className={(props.exploreMenuDisplayed ? style.dropdownOpened : style.dropdownClosed)}>
      <a onClick={props.clickExploreMenu} className={link.navigation}>
        Explore
        <i className={typography.tiAngleDown} />
      </a>
      <ul className={(props.exploreMenuDisplayed ? style.menuOpened : style.menuClosed)}>
        <li><a href='https://blockchain.info/'>Home</a></li>
        <li><a href='https://blockchain.info/charts'>Charts</a></li>
        <li><a href='https://blockchain.info/stats'>Stats</a></li>
        <li><a href='https://blockchain.info/markets'>Markets</a></li>
        <li><a href='https://blockchain.info/api'>API</a></li>
      </ul>
    </nav>
  )
}

ExploreMenu.propTypes = {
  exploreMenuDisplayed: PropTypes.bool.isRequired,
  clickExploreMenu: PropTypes.func.isRequired
}

export default ExploreMenu
