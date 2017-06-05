import React from 'react'

import style from './style.scss'
import link from 'sass/elements/link.scss'

const Ticker = () => {
  return (
    <a href='https://markets.blockchain.info' className={link.navigation}>1 BTC = £2,071.37</a>
  )
}

export default Ticker
