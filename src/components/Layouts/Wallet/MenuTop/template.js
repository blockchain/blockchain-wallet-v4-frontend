import React from 'react'
import CSSModules from 'react-css-modules'

import RequestBitcoin from './RequestBitcoin'
import SendBitcoin from './SendBitcoin'
import ClipboardNextAddress from './ClipboardNextAddress'

import style from './style.scss'

const MenuTop = () => {
  return (
    <div styleName='menu-top'>
      <div className='container-fluid height-100'>
        <div className='row flex-row flex-between flex-center padding-5'>
          <span className='f-28 upper half-strong'>Be your own bank.</span>
          <span className='f-28 half-strong'>0.00199132 BTC</span>
        </div>
        <div className='row flex-row flex-between flex-center padding-5'>
          <div className='row flex-row flex-between flex-center' styleName='button-container'>
            <SendBitcoin />
            <div>
              <RequestBitcoin />
              <ClipboardNextAddress />
            </div>
          </div>
          <span className='f-24'>£4.12</span>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
