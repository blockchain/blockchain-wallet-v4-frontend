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
        <div className='row flex-row flex-between flex-center padding-5'>
          <div className='col-md-6 flex-column flex-justify flex-center'>
            <div className='row'>
              <span className='f-28 upper half-strong'>Be your own bank.</span>
            </div>
            <div className='row flex-row flex-start flex-center padding-top-10'>
              <div className='padding-right-10'>
                <SendBitcoin />
              </div>
              <div styleName='button-container'>
                <RequestBitcoin />
                <ClipboardNextAddress />
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <Balance />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSSModules(MenuTop, style)
