import React from 'react'
import { lighten } from 'polished'
import styled from 'styled-components'
import { Link } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding: 2px 5px;
  background-color: ${props => props.selected && lighten(0.47, props.theme['brand-secondary'])};
  border: ${props => props.selected && `1px solid ${lighten(0.3, props.theme['brand-secondary'])}`};
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
