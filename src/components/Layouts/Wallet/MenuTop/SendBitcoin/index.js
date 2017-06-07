import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const SendBitcoin = () => {
  return (
    <button className='button-empty'>
      <i className='icon-send margin-right-5' />
      Send
    </button>
  )
}

export default CSSModules(SendBitcoin, style)
