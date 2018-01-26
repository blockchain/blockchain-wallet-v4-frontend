import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  font-size: 20px;
  font-weight: 200;
  text-align: right;
  color: ${props => props.theme['gray-5']};
  padding-right: ${props => props.large ? '15px' : '25px'};
  font-family: 'Montserrat', Helvetica, sans-serif;
`

const TotalFiatBalance = styled.span`
`

const Success = props => {
  return (
    <Wrapper large={props.large}>
      <TotalFiatBalance>{props.symbol + props.totalFiatBalance.toFixed(2)}</TotalFiatBalance>
    </Wrapper>
  )
}

export default Success
