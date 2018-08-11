import React from 'react'
import PropTypes from 'prop-types'

import BchAddresses from './Bch'
import BtcAddresses from './Btc'
import EthAddresses from './Eth'

const Addresses = props => {
  const { coin, ...rest } = props

  switch (coin) {
    case 'BTC':
      return <BtcAddresses {...rest} />
    case 'BCH':
      return <BchAddresses {...rest} />
    case 'ETH':
      return <EthAddresses {...rest} />
    default:
      return <BtcAddresses {...rest} />
  }
}

Addresses.propTypes = {
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired
}

export default Addresses
