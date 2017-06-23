import React from 'react'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const SendBitcoin = () => {
  return (
    <button className='button-empty'>
      <i className='icon-send margin-right-5' />
      <FormattedMessage id='components.layouts.wallet.menutop.sendbitcoin.send' defaultMessage='Send' />
    </button>
  )
}

export default CSSModules(SendBitcoin, style)
