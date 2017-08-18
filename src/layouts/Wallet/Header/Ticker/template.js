import React from 'react'
import PropTypes from 'prop-types'
import { NavItem } from 'react-bootstrap'
import { Text } from 'blockchain-info-components'

const Ticker = (props) => {
  const { coin, fiat } = props

  return (
    <NavItem href='https://markets.blockchain.info'>
      <Text small light white>{`${coin} = ${fiat}`}</Text>
    </NavItem>
  )
}

Ticker.propTypes = {
  coin: PropTypes.string.isRequired,
  fiat: PropTypes.string.isRequired
}

export default Ticker
