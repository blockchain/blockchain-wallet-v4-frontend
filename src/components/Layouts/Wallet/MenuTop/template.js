import React from 'react'

import RequestBitcoin from './RequestBitcoin'
import SendBitcoin from './SendBitcoin'
import ClipboardNextAddress from './ClipboardNextAddress'

import style from './style.scss'
import typography from 'sass/utilities/typography.scss'

const MenuTop = () => {
  return (
    <div className={style.menuTop}>
      <div className={style.left}>
        <span className={typography.big}>Be your own bank.</span>
        <div>
          <SendBitcoin />
          <RequestBitcoin />
          <ClipboardNextAddress />
        </div>
      </div>
      <div className={style.right}>
        <span className={typography.big}>0.00199132 BTC</span>
        <span className={typography.medium}>£4.12</span>
      </div>
    </div>
  )
}

export default MenuTop
