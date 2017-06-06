import React from 'react'
import { NavLink } from 'react-router-dom'
import classNames from 'classnames'

import style from './style.scss'
import button from 'sass/elements/button.scss'
import grid from 'sass/elements/grid.scss'
import typography from 'sass/utilities/typography.scss'

const Main = () => {
  return (
    <section className={style.main}>
      <div className={classNames(grid.container, grid.valignCenter)}>
        <div className={classNames(grid.row, grid.alignCenter, typography.padding25)}>
          <span className={typography.f52}>The World's Most Popular Bitcoin Wallet</span>
        </div>
        <div className={classNames(grid.row, typography.padding25)}>
          <div className={classNames(grid.colMd4, grid.valignCenter)}>
            <span className={typography.xLarge}>100 Million+</span>
            <span className={typography.light}>Transactions</span>
          </div>
          <div className={classNames(grid.colMd4, grid.valignCenter)}>
            <span className={typography.xLarge}>13 Million+</span>
            <span className={typography.light}>Wallets</span>
          </div>
          <div className={classNames(grid.colMd4, grid.valignCenter)}>
            <span className={typography.xLarge}>140+</span>
            <span className={typography.light}>Countries Served</span>
          </div>
        </div>
        <div className={classNames(grid.row, typography.padding25)}>
          <div className={classNames(grid.colMd4, grid.colMdOffset4, grid.valignCenter)}>
            <NavLink className={classNames(button.primary, style.button)} to='/register'>Create your wallet</NavLink>
            <span>or</span>
            <NavLink className={classNames(button.secondary, style.button)} to='/login'>Login</NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Main
