import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import Adverts from './Adverts'
import Footer from './Footer'

import style from './style.scss'

const MenuLeft = (props) => {
  return (
    <nav styleName='menu-left'>
      <div className='container'>
        <div className='row'>
          <div className='col-12 align-items-center'>
            <NavLink className='menu-item' to='/wallet' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-home' />
              <FormattedMessage id='components.layouts.wallet.menuleft.home' defaultMessage='Home' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/transactions' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-tx' />
              <FormattedMessage id='components.layouts.wallet.menuleft.transactions' defaultMessage='Transactions' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/buy-sell' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-bitcoin' />
              <FormattedMessage id='components.layouts.wallet.menuleft.buybitcoin' defaultMessage='Buy bitcoin' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/security-center' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-lock' />
              <FormattedMessage id='components.layouts.wallet.menuleft.securitycenter' defaultMessage='Security center' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/settings' activeClassName='active' onClick={props.clickSecurityCenter}>
              <i className='icon-settings' />
              <FormattedMessage id='components.layouts.wallet.menuleft.settings' defaultMessage='Settings' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/info' activeClassName='active'>
              <FormattedMessage id='components.layouts.wallet.menuleft.walletinfo' defaultMessage='Wallet information' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/preferences' activeClassName='active'>
              <FormattedMessage id='components.layouts.wallet.menuleft.preferences' defaultMessage='Preferences' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/security' activeClassName='active'>
              <FormattedMessage id='components.layouts.wallet.menuleft.security' defaultMessage='Security' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/addresses' activeClassName='active'>
              <FormattedMessage id='components.layouts.wallet.menuleft.addresses' defaultMessage='Addresses' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/faq' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-help' />
              <FormattedMessage id='components.layouts.wallet.menuleft.faq' defaultMessage='Faq' />
            </NavLink>
          </div>
        </div>
      </div>
      <Adverts />
      <Footer />
    </nav>
  )
}

export default CSSModules(MenuLeft, style)
