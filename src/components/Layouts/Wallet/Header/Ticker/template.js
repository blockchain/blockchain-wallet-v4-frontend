import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Ticker = (props) => {
  return (
    <a href='https://markets.blockchain.info' className='navigation'>{`${props.bitcoinAmount} ${props.bitcoinUnit} - ${props.currencyAmount} ${props.currencyUnit}`}</a>
  )
}

export default CSSModules(Ticker, style)
