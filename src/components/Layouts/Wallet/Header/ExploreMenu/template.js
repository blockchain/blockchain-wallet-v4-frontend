import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import style from './style.scss'
import link from 'sass/elements/link.scss'
import fonts from 'sass/utilities/fonts.scss'
import typography from 'sass/utilities/typography.scss'

const ExploreMenu = (props) => {
  return (
    <nav className={(props.exploreMenuDisplayed ? style.dropdownOpened : style.dropdownClosed)}>
      <a onClick={props.clickExploreMenu} className={link.navigation}>
        Explore
        <i className={classNames(fonts.tiAngleDown, typography.marginLeft5)} />
      </a>
      <div className={(props.exploreMenuDisplayed ? style.menuOpened : style.menuClosed)}>
        <a className={link.navigationSub} href='https://blockchain.info/'>Home</a>
        <a className={link.navigationSub} href='https://blockchain.info/charts'>Charts</a>
        <a className={link.navigationSub} href='https://blockchain.info/stats'>Stats</a>
        <a className={link.navigationSub} href='https://blockchain.info/markets'>Markets</a>
        <a className={link.navigationSub} href='https://blockchain.info/api'>API</a>
      </div>
    </nav>
  )
}

ExploreMenu.propTypes = {
  exploreMenuDisplayed: PropTypes.bool.isRequired,
  clickExploreMenu: PropTypes.func.isRequired
}

export default ExploreMenu
