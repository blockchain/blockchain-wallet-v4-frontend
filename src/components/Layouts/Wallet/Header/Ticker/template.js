import React from 'react'
import PropTypes from 'prop-types'

import { NavItem } from 'components/generic/Navbar'
import { Typography } from 'components/generic/Typography'

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
