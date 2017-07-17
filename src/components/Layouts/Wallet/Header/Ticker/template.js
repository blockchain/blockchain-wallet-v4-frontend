import React from 'react'
import PropTypes from 'prop-types'

import { NavItem } from 'components/generic/Navbar'
import { Typography } from 'components/generic/Typography'

const Ticker = (props) => {
  console.log(props)
  return (
    <NavItem href='https://markets.blockchain.info'>
      <Typography small light white>{`${props.bitcoinValue} = ${props.currencyValue}`}</Typography>
    </NavItem>
  )
}

Ticker.propTypes = {
  bitcoinValue: PropTypes.string.isRequired,
  currencyValue: PropTypes.string.isRequired
}

export default Ticker
