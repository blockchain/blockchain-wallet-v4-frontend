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
      <div className='container-fluid height-100'>
        <div className='row'>
          <div className='col-12 col-md-8'>
            <div className='row hidden-md-down'>
              <span className='f-28 text-uppercase'>Be your own bank.</span>
            </div>
            <div className='row'>
              <div className='padding-right-10'>
                <SendBitcoin />
              </div>
              <div>
                <RequestBitcoin />
                <ClipboardNextAddress />
              </div>
            </div>
          </div>
          <div className='col-12 col-md-4'>
            <Balance />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
