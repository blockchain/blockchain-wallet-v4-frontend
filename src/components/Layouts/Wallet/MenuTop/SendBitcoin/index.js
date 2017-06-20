import React from 'react'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'

import style from './style.scss'

const SendBitcoin = () => {
  return (
    <button className='button-empty'>
      <i className='icon-send margin-right-5' />
      <Translate translate='SEND' />
    </button>
  )
}

export default CSSModules(SendBitcoin, style)
