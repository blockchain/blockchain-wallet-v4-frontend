import React from 'react'
import CSSModules from 'react-css-modules'

import MenuLeftLink from './MenuLeftLink'
import SubMenuLeftLink from './SubMenuLeftLink'

import style from './style.scss'

const MenuLeft = () => {
  return (
    <nav styleName='menu-left'>
      <ul styleName='navigation'>
        <MenuLeftLink route='/wallet' title='Home' />
        <MenuLeftLink route='/transactions' title='Transactions' />
        <MenuLeftLink route='/buy-sell' title='Buy bitcoin' />
        <MenuLeftLink route='/security-center' title='Security center' />
        <MenuLeftLink route='/settings' title='Settings' />
        <div styleName='sub-menu-left'>
          <SubMenuLeftLink route='/settings/info' title='Wallet Information' />
          <SubMenuLeftLink route='/settings/preferences' title='Preferences' />
          <SubMenuLeftLink route='/settings/security' title='Security' />
          <SubMenuLeftLink route='/settings/addresses' title='Addresses' />
        </div>
        <MenuLeftLink route='/faq' title='Faq' />
      </ul>
    </nav>
  )
}

export default CSSModules(MenuLeft, style)
