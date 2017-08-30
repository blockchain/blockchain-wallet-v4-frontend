import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'blockchain-info-components'

const Ticker = (props) => {
  const { fiat } = props

  return (
    <Link href='https://markets.blockchain.info' size='14px' weight={300} color='white'>
      {`1 BTC = ${fiat}`}
    </Link>
  )
}

Ticker.propTypes = {
  coin: PropTypes.string.isRequired,
  fiat: PropTypes.string.isRequired
}

export default Ticker
