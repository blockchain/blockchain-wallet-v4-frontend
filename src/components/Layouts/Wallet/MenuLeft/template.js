import React from 'react'
import CSSModules from 'react-css-modules'
import { NavLink } from 'react-router-dom'

import Translate from 'components/Shared/Translate'
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
              <Translate translate='HOME' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/transactions' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-tx' />
              <Translate translate='MY_TRANSACTIONS' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/buy-sell' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-bitcoin' />
              <Translate translate='BUY_BITCOIN' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/security-center' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-lock' />
              <Translate translate='SECURITY_CENTER' />
            </NavLink>
          </div>
        </div>
         <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/settings' activeClassName='active' onClick={props.clickSecurityCenter}>
              <i className='icon-settings' />
              <Translate translate='SETTINGS' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/info' activeClassName='active'>
              <Translate translate='WALLET_INFO' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/preferences' activeClassName='active'>
              <Translate translate='PREFERENCES' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/security' activeClassName='active'>
              <Translate translate='SECURITY' />
            </NavLink>
          </div>
        </div>
        <div className={`row ${props.securityCenterMenuDisplayed ? 'visible' : 'hidden'}`}>
          <div className='col-12'>
            <NavLink className='menu-item sub' to='/settings/addresses' activeClassName='active'>
              <Translate translate='MENU_ACCOUNTS_AND_ADDRESSES' />
            </NavLink>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <NavLink className='menu-item' to='/faq' activeClassName='active' onClick={props.clickOthers}>
              <i className='icon-help' />
              <Translate translate='FAQ' />
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
