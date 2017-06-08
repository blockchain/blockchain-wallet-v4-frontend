import React from 'react'
import CSSModules from 'react-css-modules'
import { NavLink } from 'react-router-dom'

import Adverts from './Adverts'
import Footer from './Footer'

import style from './style.scss'

const MenuLeft = (props) => {
  return (
    <nav styleName='menu-left'>
      <div>
        <NavLink className='menu-item' to='/wallet' activeClassName='active'>
          <i className='icon-home icon' /><span>Home</span>
        </NavLink>
        <NavLink className='menu-item' to='/transactions' activeClassName='active'>
          <i className='icon-tx icon' /><span>Transactions</span>
        </NavLink>
        <NavLink className='menu-item' to='/buy-sell' activeClassName='active'>
          <i className='icon-bitcoin icon' /><span>Buy bitcoin</span>
        </NavLink>
        <NavLink className='menu-item' to='/security-center' activeClassName='active'>
          <i className='icon-lock icon' /><span>Security center</span>
        </NavLink>
        <NavLink className='menu-item' to='/settings/info' activeClassName='active' onClick={props.clickSecurityCenter}>
          <i className='icon-settings icon' /><span>Settings</span>
        </NavLink>
        <div className={(props.securityCenterMenuDisplayed ? 'visible' : 'hidden')}>
          <NavLink className='menu-item sub' to='/settings/info' activeClassName='active'>
            <span>Wallet Information</span>
          </NavLink>
          <NavLink className='menu-item sub' to='/settings/preferences' activeClassName='active'>
            <span>Preferences</span>
          </NavLink>
          <NavLink className='menu-item sub' to='/settings/security' activeClassName='active'>
            <span>Security</span>
          </NavLink>
          <NavLink className='menu-item sub' to='/settings/addresses' activeClassName='active'>
            <span>Addresses</span>
          </NavLink>
        </div>
        <NavLink className='menu-item' to='/faq' activeClassName='active'>
          <i className='icon-help icon' /><span>Faq</span>
        </NavLink>
      </div>
      <Adverts />
      <Footer />
    </nav>
  )
}

export default CSSModules(MenuLeft, style)
