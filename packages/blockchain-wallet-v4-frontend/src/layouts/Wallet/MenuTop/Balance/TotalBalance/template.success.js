import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

const Wrapper = styled.div`
  text-align: right;
  color: ${props => props.theme['gray-5']};
  font-size: ${props => props.large ? '20px' : '12px'};
  font-weight: ${props => props.large ? '200' : '300'};
  padding-right: ${props => props.large ? '15px' : '25px'};
  font-family: 'Montserrat', Helvetica, sans-serif;
  span {
    text-transform: capitalize;
    &:last-child {
      margin-left: 10px;
      color: ${props => props.theme['gray-3']}
    }
  }
`

const Success = props => {
  const amount = <span>{props.symbol + props.totalFiatBalance}</span>
  if (!props.large) {
    return (
      <LinkContainer to='/home'>
        <Wrapper>
          <FormattedMessage id='scenes.wallet.menutop.balance.totalbalance' defaultMessage='Total Balance' />
          { amount }
        </Wrapper>
      </LinkContainer>
    )
  } else {
    return (
      <Wrapper large>
        { amount }
      </Wrapper>
    )
  }
}

export default Success
