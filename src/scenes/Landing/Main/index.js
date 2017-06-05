import React from 'react'
import { NavLink } from 'react-router-dom'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import typography from 'sass/utilities/typography.scss'

const Main = () => {
  return (
    <section className={style.main}>
      <div className={style.rowHorizontal}>
        <span className={typography.h2}>The World's Most Popular Bitcoin Wallet</span>
      </div>
      <div className={style.rowHorizontal}>
        <div className={style.column}>
          <span className={typography.h3}>100 Million+</span>
          <span className={typography.h4}>Transactions</span>
        </div>
        <div className={style.column}>
          <span className={typography.h3}>13 Million+</span>
          <span className={typography.h4}>Wallets</span>
        </div>
        <div className={style.column}>
          <span className={typography.h3}>140+</span>
          <span className={typography.h4}>Countries Served</span>
        </div>
      </div>
      <div className={style.rowVertical}>
        <NavLink className={`${button.primary} ${style.button}`} to='/register'>Create your wallet</NavLink>
        <span className={typography.h4}>or</span>
        <NavLink className={`${button.secondary} ${style.button}`} to='/login'>Login</NavLink>
      </div>
    </section>
  )
}

export default Main
