import React from 'react'
import CSSModules from 'react-css-modules'

import RequestBitcoin from './RequestBitcoin'
import SendBitcoin from './SendBitcoin'
import ClipboardNextAddress from './ClipboardNextAddress'

import style from './style.scss'

const MenuTop = () => {
  return (
    <div styleName='menu-top'>
      <div styleName='left'>
        <span className='big'>Be your own bank.</span>
        <div>
          <SendBitcoin />
          <RequestBitcoin />
          <ClipboardNextAddress />
        </div>
      </div>
      <div styleName='right'>
        <span className='big'>0.00199132 BTC</span>
        <span className='medium'>£4.12</span>
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
