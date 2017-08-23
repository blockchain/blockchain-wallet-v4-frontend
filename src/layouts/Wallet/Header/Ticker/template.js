import React from 'react'
import PropTypes from 'prop-types'
import { NavItem } from 'react-bootstrap'
import { Text, DefaultColor } from 'blockchain-info-components'

const Ticker = (props) => {
  const { coin, fiat } = props

  return (
    <NavItem href='https://markets.blockchain.info'>
      <Text size='14px' weight={300} color={DefaultColor.white} >{`${coin} = ${fiat}`}</Text>
    </NavItem>
  )
}

Ticker.propTypes = {
  coin: PropTypes.string.isRequired,
  fiat: PropTypes.string.isRequired
}

export default Ticker
