import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Navigation = (props) => {
  return (
    <nav styleName='navigation'>
      <NavLink styleName='menu-item' to='/wallet' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-home' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.home' defaultMessage='Home' />
      </NavLink>
      <NavLink styleName='menu-item' to='/transactions' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-tx' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.transactions' defaultMessage='Transactions' />
      </NavLink>
      <NavLink styleName='menu-item' to='/buy-sell' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-bitcoin' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.buybitcoin' defaultMessage='Buy bitcoin' />
      </NavLink>
      <NavLink styleName='menu-item' to='/security-center' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-lock' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.securitycenter' defaultMessage='Security center' />
      </NavLink>
      <NavLink styleName='menu-item' to='/settings' activeClassName='active' onClick={props.clickSecurityCenter}>
        <i className='icon-settings' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.settings' defaultMessage='Settings' />
      </NavLink>
      <NavLink styleName={`${props.securityCenterMenuDisplayed ? 'menu-item-sub' : 'hidden'}`} to='/settings/info' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.walletinfo' defaultMessage='Wallet information' />
      </NavLink>
      <NavLink styleName={`${props.securityCenterMenuDisplayed ? 'menu-item-sub' : 'hidden'}`} to='/settings/preferences' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.preferences' defaultMessage='Preferences' />
      </NavLink>
      <NavLink styleName={`${props.securityCenterMenuDisplayed ? 'menu-item-sub' : 'hidden'}`} to='/settings/security' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.security' defaultMessage='Security' />
      </NavLink>
      <NavLink styleName={`${props.securityCenterMenuDisplayed ? 'menu-item-sub' : 'hidden'}`} to='/settings/addresses' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.addresses' defaultMessage='Addresses' />
      </NavLink>
      <NavLink styleName='menu-item' to='/faq' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-help' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.faq' defaultMessage='Faq' />
      </NavLink>
    </nav>
  )
}

export default CSSModules(Navigation, style)
