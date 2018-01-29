import React from 'react'
import styled from 'styled-components'
import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding-left: 5px;
`

export default props => {
  const { selected, children, coin, ...rest } = props

  return (
    <Wrapper>
      <Link size='14px' weight={300} color={selected ? 'brand-secondary' : 'gray-1'} {...rest}>
        {`${coin} = ${children}`}
      </Link>
    </Wrapper>
  )
}
