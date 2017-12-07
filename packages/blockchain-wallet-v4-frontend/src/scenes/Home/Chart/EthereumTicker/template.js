import React from 'react'
import { Link } from 'blockchain-info-components'

const EthereumTicker = (props) => {
  const { selected, children, ...rest } = props

  return (
    <Link size='24px' weight={300} color={selected ? 'brand-primary' : 'gray-1'} {...rest}>
      {`ETH = ${children}`}
    </Link>
  )
}

export default EthereumTicker
