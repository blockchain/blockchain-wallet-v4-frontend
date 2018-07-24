import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import { LinkContainer } from 'react-router-bootstrap'

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  padding-left: 5px;
  padding-right: ${props => props.large ? '15px' : '25px'};
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${props => props.theme['gray-3']}
    }
  }
`

const Success = props => {
  const { large, balance } = props

  return (
    <LinkContainer to='/btc/transactions'>
      <Wrapper large={large}>
        <CoinDisplay coin='BTC' cursor='pointer' size={large ? '20px' : '12px'} weight={large ? 200 : 300}>{balance}</CoinDisplay>
        <FiatDisplay coin='BTC' cursor='pointer' size={large ? '20px' : '12px'} weight={large ? 200 : 300}>{balance}</FiatDisplay>
      </Wrapper>
    </LinkContainer>
  )
}

Success.propTypes = {
  balance: PropTypes.number.isRequired
}

export default Success
