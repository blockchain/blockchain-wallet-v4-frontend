import React from 'react'
import CSSModules from 'react-css-modules'

import RequestBitcoin from './RequestBitcoin'
import SendBitcoin from './SendBitcoin'
import ClipboardNextAddress from './ClipboardNextAddress'
import Balance from './Balance'

import style from './style.scss'

const MenuTop = () => {
  return (
    <div styleName='menu-top'>
      <div>
        <span className='h5 text-uppercase'>Be your own bank.</span>
        <div styleName='actions'>
          <div className='padding-right-10'>
            <SendBitcoin />
          </div>
          <RequestBitcoin />
          <ClipboardNextAddress />
        </div>
      </div>
      <div>
        <Balance />
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
