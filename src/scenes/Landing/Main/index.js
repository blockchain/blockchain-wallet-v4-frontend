import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import typography from 'sass/utilities/typography.scss'

const Main = () => {
  return (
    <section className={style.main}>
      <div className={style.rowHorizontal}>
        <span className={typography.f52}>The World's Most Popular Bitcoin Wallet</span>
      </div>
      <div className={style.rowHorizontal}>
        <div className={style.column}>
          <span className={typography.f32}>100 Million+</span>
          <span className={typography.f20}>Transactions</span>
        </div>
        <div className={style.column}>
          <span className={typography.f32}>13 Million+</span>
          <span className={typography.f20}>Wallets</span>
        </div>
        <div className={style.column}>
          <span className={typography.f32}>140+</span>
          <span className={typography.f20}>Countries Served</span>
        </div>
      </div>
      <div className={style.rowVertical}>
        <NavLink className={classNames(button.primary, style.button)} to='/register'>Create your wallet</NavLink>
        <span>or</span>
        <NavLink className={classNames(button.secondary, style.button)} to='/login'>Login</NavLink>
      </div>
    </section>
  )
}

export default Main
