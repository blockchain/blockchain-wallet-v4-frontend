import React from 'react'
import PropTypes from 'prop-types'

const Ticker = (props) => {
  return (
    <li className='nav-item active'>
      <a className='nav-link' href='https://markets.blockchain.info'>{`${props.bitcoinValue} - ${props.currencyValue}`}</a>
    </li>
  )
}

Ticker.propTypes = {
  bitcoinValue: PropTypes.string.isRequired,
  currencyValue: PropTypes.string.isRequired
}

export default Ticker
