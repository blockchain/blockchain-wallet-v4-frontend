import React from 'react'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const RequestBitcoin = () => {
  return (
    <button className='button-empty left'>
      <i className='icon-receive margin-right-5' />
      <FormattedMessage id='components.layouts.wallet.menutop.requestbitcoin.request' defaultMessage='Request' />
    </button>
  )
}

export default CSSModules(RequestBitcoin, style)
