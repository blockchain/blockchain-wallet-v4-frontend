import React from 'react'
import { Link } from 'blockchain-info-components'

const BitcoinTicker = (props) => {
  const { selected, children, ...rest } = props

  return (
    <Link size='24px' weight={300} color={selected ? 'brand-primary' : 'gray-1'} {...rest}>
      {`BTC = ${children}`}
    </Link>
  )
}

export default BitcoinTicker
