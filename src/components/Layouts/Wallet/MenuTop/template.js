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
        <div className='row'>
          <div className='col-md-6 left-align'>
            <span className='f-28 upper half-strong'>Be your own bank.</span>
          </div>
          <div className='col-md-6 right-align'>
            <span className='f-28 half-strong'>0.00199132 BTC</span>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6 left-align margin-vertical-5'>
            <SendBitcoin />
            <RequestBitcoin />
            <ClipboardNextAddress />
          </div>
          <div className='col-md-6 right-align'>
            <span className='f-24'>£4.12</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
