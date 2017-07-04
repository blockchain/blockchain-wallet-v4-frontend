import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

const Navigation = (props) => {
  return (
    <nav>
      <NavLink to='/wallet' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-home' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.home' defaultMessage='Home' />
      </NavLink>
      <NavLink to='/transactions' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-tx' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.transactions' defaultMessage='Transactions' />
      </NavLink>
      <NavLink to='/buy-sell' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-bitcoin' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.buybitcoin' defaultMessage='Buy bitcoin' />
      </NavLink>
      <NavLink to='/security-center' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-lock' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.securitycenter' defaultMessage='Security center' />
      </NavLink>
      <NavLink to='/settings' activeClassName='active' onClick={props.clickSecurityCenter}>
        <i className='icon-settings' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.settings' defaultMessage='Settings' />
      </NavLink>
      <NavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/info' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.walletinfo' defaultMessage='Wallet information' />
      </NavLink>
      <NavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/preferences' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.preferences' defaultMessage='Preferences' />
      </NavLink>
      <NavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/security' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.security' defaultMessage='Security' />
      </NavLink>
      <NavLink className={`${props.securityCenterMenuDisplayed}`} to='/settings/addresses' activeClassName='active'>
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.addresses' defaultMessage='Addresses' />
      </NavLink>
      <NavLink to='/faq' activeClassName='active' onClick={props.clickOthers}>
        <i className='icon-help' />
        <FormattedMessage id='components.layouts.wallet.menuleft.navigation.faq' defaultMessage='Faq' />
      </NavLink>
    </nav>
  )
}

export default Navigation
