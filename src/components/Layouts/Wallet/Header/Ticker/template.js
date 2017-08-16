import React from 'react'
import PropTypes from 'prop-types'

import { NavItem, Typography } from 'blockchain-info-components'

const Ticker = (props) => {
  const { coin, fiat } = props

  return (
    <NavItem href='https://markets.blockchain.info'>
      <Typography small light white>{`${coin} = ${fiat}`}</Typography>
    </NavItem>
  )
}

Ticker.propTypes = {
  coin: PropTypes.string.isRequired,
  fiat: PropTypes.string.isRequired
}

export default Ticker
