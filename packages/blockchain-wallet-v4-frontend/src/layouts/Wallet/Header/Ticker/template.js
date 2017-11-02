import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'blockchain-info-components'

const Ticker = (props) => {
  const { bitcoinRate, ethereumRate } = props

  return (
    <Link href='https://markets.blockchain.info' size='14px' weight={300} color='white'>
      {`1 BTC = ${bitcoinRate} | 1 ETH = ${ethereumRate}`}
    </Link>
  )
}

Ticker.propTypes = {
  bitcoinRate: PropTypes.string.isRequired,
  ethereumRate: PropTypes.string.isRequired
}

export default Ticker
