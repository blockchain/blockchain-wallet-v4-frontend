import React from 'react'
import styled from 'styled-components'
import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding-left: 5px;
`

const EthereumTicker = (props) => {
  const { selected, children, ...rest } = props

  return (
    <Wrapper>
      <Link size='24px' weight={300} color={selected ? 'brand-primary' : 'gray-1'} {...rest}>
        {`ETH = ${children}`}
      </Link>
    </Wrapper>
  )
}

export default EthereumTicker
