import React from 'react'
import CSSModules from 'react-css-modules'

import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'
import Alerts from 'components/Shared/Alerts'

import style from './style.scss'

const WalletLayout = (props) => (
  <div styleName='wallet-layout'>
    <Alerts />
    <div styleName='header'>
      <Header />
    </div>
    <div styleName='main'>
      <div styleName='menu-left'>
        <MenuLeft location={props.location} />
      </div>
      <div styleName='content'>
        <div styleName='menu-top'>
          <MenuTop />
        </div>
        <div styleName='page'>
          {props.children}
        </div>
      </div>
    </div>
  </div>
)

export default CSSModules(WalletLayout, style)
