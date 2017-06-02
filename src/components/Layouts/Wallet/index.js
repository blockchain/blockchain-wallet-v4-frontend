import React from 'react'
import { Route } from 'react-router-dom'

import Header from './Header'
import MenuLeft from './MenuLeft'
import MenuTop from './MenuTop'

import style from './style.scss'

const WalletLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className={style.wallet}>
        <div className={style.header}>
          <Header />
        </div>
        <div className={style.content}>
          <div className={style.left}>
            <MenuLeft />
          </div>
          <div className={style.right}>
            <div className={style.top}>
              <MenuTop />
            </div>
            <div className={style.page}>
              <Component {...matchProps} />
            </div>
          </div>
        </div>
      </div>
    )} />
  )
}

export default WalletLayout
