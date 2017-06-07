import React from 'react'
import CSSModules from 'react-css-modules'

import Adverts from './Adverts'
import Footer from './Footer'
import MenuLeftLink from './MenuLeftLink'
import SubMenuLeftLink from './SubMenuLeftLink'

import style from './style.scss'

const MenuLeft = () => {
  return (
    <nav styleName='menu-left'>
      <ul>
        <MenuLeftLink route='/wallet' title='Home' />
        <MenuLeftLink route='/transactions' title='Transactions' />
        <MenuLeftLink route='/buy-sell' title='Buy bitcoin' />
        <MenuLeftLink route='/security-center' title='Security center' />
        <MenuLeftLink route='/settings' title='Settings' />
        <ul>
          <SubMenuLeftLink route='/settings/info' title='Wallet Information' />
          <SubMenuLeftLink route='/settings/preferences' title='Preferences' />
          <SubMenuLeftLink route='/settings/security' title='Security' />
          <SubMenuLeftLink route='/settings/addresses' title='Addresses' />
        </ul>
        <MenuLeftLink route='/faq' title='Faq' />
      </ul>
      <Adverts />
      <Footer />
    </nav>
  )
}

export default CSSModules(MenuLeft, style)
