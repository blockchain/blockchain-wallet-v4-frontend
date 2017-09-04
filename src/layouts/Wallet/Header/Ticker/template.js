import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'blockchain-info-components'

const Ticker = (props) => {
  const { coin, fiat } = props

  return (
    <Link href='https://markets.blockchain.info' size='14px' weight={300} color='white'>
      {`${coin} = ${fiat}`}
    </Link>
  )
}

Ticker.propTypes = {
  coin: PropTypes.string.isRequired,
  fiat: PropTypes.string.isRequired
}

export default Ticker
