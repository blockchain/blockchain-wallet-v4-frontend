import React from 'react'
import PropTypes from 'prop-types'

import BtcDisplay from './BtcDisplay'
import EthDisplay from './EthDisplay'

const CoinDisplay = props => {
  const { coin, children } = props
  const amount = children || '0'
  return (
    coin === 'BTC' ? <BtcDisplay amount={amount} /> : <EthDisplay amount={amount} />
  )
}

CoinDisplay.propTypes = {
  coin: PropTypes.oneOf(['BTC', 'ETH']),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default CoinDisplay
