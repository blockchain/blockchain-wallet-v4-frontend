import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Text } from '../Text'
import { Link } from '../Links'
import { OrderHistoryHeader } from '../History'

const ExchangeTrade = styled.div`
  display: grid;
  grid-template-columns: 35% 25% 20% 15% 5%;
  border-right: 1px solid #DDD;
  border-bottom: 1px solid #DDD;
  border-left: 1px solid #DDD;
  width: 100%;
`
const ExchangeStatus = styled.div`
  padding: 15px 0px 15px 25px;
  display: grid;
  grid-template-columns: 50% 50%;
`
const ExchangeCell = styled.div`
  padding: 15px 0px;
`
const ExchangeIn = styled(ExchangeCell)`
  display: flex;
  opacity: ${props => props.first ? '25px' : ''};
`
const TradeText = styled(Text)`
  color: ${props => props.color === 'complete'
    ? props.theme['success']
    : props.color === 'pending'
      ? props.theme['gray-2']
      : props.color === 'failed'
        ? props.theme['error']
        : 'black'};
  opacity: ${props => props.opacity === 'pending' ? '0.3' : '1'}
`

const Trade = props => {
  const { trade, openTradeDetails } = props
  const { state, date, depositAmount, withdrawalAmount } = trade

  return (
    <ExchangeTrade>
      <ExchangeStatus>
        <TradeText size='13px' weight={300} color={state} capitalize>
          {state}
        </TradeText>
        <Link size='13px' onClick={openTradeDetails}>
          View Details
        </Link>
      </ExchangeStatus>
      <ExchangeCell>
        <Text size='13px' weight={300}>
          {date}
        </Text>
      </ExchangeCell>
      <ExchangeCell>
        <Text size='13px' weight={300}>
          {depositAmount}
        </Text>
      </ExchangeCell>
      <ExchangeIn>
        <TradeText size='13px' weight={300} opacity={state}>
          {withdrawalAmount}
        </TradeText>
      </ExchangeIn>
    </ExchangeTrade>
  )
}

Trade.propTypes = {
  openTradeDetails: PropTypes.func.isRequired,
  trade: PropTypes.shape({
    state: PropTypes.string,
    depositAmount: PropTypes,
    withdrawalAmount: PropTypes
  }).isRequired
}

export default Trade
