import React from 'react'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Ticker = () => {
  return (
    <a href='https://markets.blockchain.info' className='navigation'>1 BTC = £2,071.37</a>
  )
}

export default CSSModules(Ticker, style)
