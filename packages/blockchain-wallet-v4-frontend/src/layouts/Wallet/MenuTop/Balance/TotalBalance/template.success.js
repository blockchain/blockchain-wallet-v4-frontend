import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

const Wrapper = styled.div`
  text-align: right;
  color: ${props => props.theme['gray-5']};
  font-size: ${props => props.large ? '20px' : '12px'};
  font-weight: ${props => props.large ? '200' : '300'};
  padding-right: ${props => props.large ? '15px' : '25px'};
  font-family: 'Montserrat', Helvetica, sans-serif;
  > span:last-child {
    margin-left: 10px;
    color: ${props => props.theme['gray-3']}
  }
`

const Success = props => {
  return (
    <Wrapper large={props.large}>
      { !props.large && <FormattedMessage id='scenes.wallet.menutop.balance.totalbalance' defaultMessage='Total Balance' /> }
      <span>{props.symbol + props.totalFiatBalance.toFixed(2)}</span>
    </Wrapper>
  )
}

export default Success
