import React from 'react'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'

import style from './style.scss'

const RequestBitcoin = () => {
  return (
    <button className='button-empty left'>
      <i className='icon-receive margin-right-5' />
      <Translate translate='REQUEST' />
    </button>
  )
}

export default CSSModules(RequestBitcoin, style)
