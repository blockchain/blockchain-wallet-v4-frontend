import React from 'react'
import styled from 'styled-components'
import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding: 0px 5px;
  background-color: ${props => props.selected && props.theme['brand-quaternary']};
  border: ${props => props.selected && `1px solid ${props.theme['brand-secondary']}`};
  border-radius: ${props => props.selected && '2px'};
`

export default props => {
  const { selected, children, coin, ...rest } = props

  return (
    <Wrapper selected={selected}>
      <Link size='14px' weight={400} color='brand-secondary' {...rest}>
        {`1 ${coin} = ${children}`}
      </Link>
    </Wrapper>
  )
}
