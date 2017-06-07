import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const RequestBitcoin = () => {
  return (
    <button className='button-empty left'>
      <i className='icon-receive margin-right-5' />
      Receive
    </button>
  )
}

export default CSSModules(RequestBitcoin, style)
