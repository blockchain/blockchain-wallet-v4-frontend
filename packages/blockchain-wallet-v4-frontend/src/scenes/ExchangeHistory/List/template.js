import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Text } from 'blockchain-info-components'
import { History, HistoryCell, HistoryHeader, HistoryRow } from 'components/HistoryItem'
import OrderStatus from './OrderStatus'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  & > :first-child { margin-bottom: 10px; }
`

const List = props => {
  const { trades, handleClick } = props
  return (
    <Wrapper>
      <Text size='16px' weight={500} capitalize>
        <FormattedMessage id='scenes.exchangehistory.list.exchanges' defaultMessage='Completed exchanges' />
      </Text>
      <History>
        <HistoryHeader>
          <HistoryCell width='15%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.exchangehistory.list.status' defaultMessage='Status' />
            </Text>
          </HistoryCell>
          <HistoryCell width='15%' />
          <HistoryCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.exchangehistory.list.date' defaultMessage='Date' />
            </Text>
          </HistoryCell>
          <HistoryCell width='20%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.exchangehistory.list.exchanged' defaultMessage='Exchanged' />
            </Text>
          </HistoryCell>
          <HistoryCell width='20%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.exchangehistory.list.received' defaultMessage='Received' />
            </Text>
          </HistoryCell>
        </HistoryHeader>
        {props.trades.map((trade, index) => {
          const { date, status } = trade
          return (
            <HistoryRow key={index}>
              <HistoryCell width='15%'>
                <OrderStatus status={status} />
              </HistoryCell>
              <HistoryCell width='15%'>
                <Link size='14px' weight={300} capitalize onClick={() => handleClick(trade)}>
                  <FormattedMessage id='scenes.exchangehistory.list.details' defaultMessage='View details' />
                </Link>
              </HistoryCell>
              <HistoryCell width='30%'>
                <Text size='14px' weight={300}>{date}</Text>
              </HistoryCell>
              <HistoryCell width='20%'>
                <Text size='14px' weight={300}>0.05633931 ETH</Text>
              </HistoryCell>
              <HistoryCell width='20%'>
                <Text size='14px' weight={300}>0.00123241 BTC</Text>
              </HistoryCell>
            </HistoryRow>
          )
        })}
      </History>
    </Wrapper>
  )
}

List.propTypes = {
  trades: PropTypes.array,
  handleClick: PropTypes.func.isRequired
}

List.defaultProps = {
  trades: []
}

export default List
