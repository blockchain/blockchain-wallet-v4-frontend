import React from 'react'
import styled from 'styled-components'
import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding-right: 5px;
`

export default props => {
  const { selected, children, ...rest } = props

  return (
    <Wrapper>
      <Link size='24px' weight={300} color={selected ? 'brand-primary' : 'gray-1'} {...rest}>
        {`BTC = ${children}`}
      </Link>
    </Wrapper>
  )
}
