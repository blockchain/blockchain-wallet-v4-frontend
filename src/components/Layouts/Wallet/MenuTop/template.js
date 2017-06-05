import React from 'react'

import RequestBitcoin from './RequestBitcoin'
import SendBitcoin from './SendBitcoin'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const MenuTop = () => {
  return (
    <div className={style.menuTop}>
      <div className={style.left}>
        <span className={typography.h3}>Be your own bank.</span>
        <div>
          <SendBitcoin />
          <RequestBitcoin />
        </div>
      </div>
      <div className={style.right}>
        <span className={typography.h3}>0.00199132 BTC</span>
        <span>£4.12</span>
      </div>
    </div>
  )
}

export default MenuTop
