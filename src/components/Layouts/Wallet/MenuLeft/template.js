import React from 'react'
import MenuLeftLink from './MenuLeftLink'
import SubMenuLeftLink from './SubMenuLeftLink'

import style from './style.scss'

const MenuLeft = () => {
  return (
    <nav className={style.menuLeft}>
      <ul className={style.navigation}>
        <MenuLeftLink route='/wallet' title='Home' />
        <MenuLeftLink route='/transactions' title='Transactions' />
        <MenuLeftLink route='/buy-sell' title='Buy bitcoin' />
        <MenuLeftLink route='/security-center' title='Security center' />
        <MenuLeftLink route='/settings' title='Settings' />
        <div className={style.subMenuLeft}>
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

export default MenuLeft
