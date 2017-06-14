import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Ticker = (props) => {
  return (
    <a href='https://markets.blockchain.info' className='navigation'>{`${props.bitcoinValue} - ${props.currencyValue}`}</a>
  )
}

Ticker.propTypes = {
  bitcoinValue: PropTypes.string.isRequired,
  currencyValue: PropTypes.string.isRequired
}

export default CSSModules(Ticker, style)
