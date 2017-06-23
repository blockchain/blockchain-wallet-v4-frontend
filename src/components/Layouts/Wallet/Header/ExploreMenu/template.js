import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const ExploreMenu = (props) => {
  return (
    <li className={`nav-item dropdown ${props.exploreMenuDisplayed ? 'show' : ''}`}>
      <a className='nav-link dropdown-toggle' id='navbarDropdownMenuLink' onClick={props.clickExploreMenu}>
        <FormattedMessage id='components.layouts.wallet.header.exploremenu.explore' defaultMessage='Explore' />
      </a>
      <div className='dropdown-menu' aria-labelledby='navbarDropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded={(props.exploreMenuDisplayed ? 'true' : 'false')}>
        <a className='dropdown-item' href='https://blockchain.info/'>
          <FormattedMessage id='components.layouts.wallet.header.exploremenu.home' defaultMessage='Home' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/charts'>
          <FormattedMessage id='components.layouts.wallet.header.exploremenu.charts' defaultMessage='Charts' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/stats'>
          <FormattedMessage id='components.layouts.wallet.header.exploremenu.stats' defaultMessage='Stats' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/markets'>
          <FormattedMessage id='components.layouts.wallet.header.exploremenu.market' defaultMessage='Markets' />
        </a>
        <a className='dropdown-item' href='https://blockchain.info/api'>
          <FormattedMessage id='components.layouts.wallet.header.exploremenu.api' defaultMessage='Api' />
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
