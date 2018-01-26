import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-size: 20px;
  font-weight: 200;
  text-align: right;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
`

const TotalFiatBalance = styled.span`
`

const Success = props => {
  return (
    <Wrapper>
      <TotalFiatBalance>{props.symbol + props.totalFiatBalance.toFixed(2)}</TotalFiatBalance>
    </Wrapper>
  )
}

export default Success
