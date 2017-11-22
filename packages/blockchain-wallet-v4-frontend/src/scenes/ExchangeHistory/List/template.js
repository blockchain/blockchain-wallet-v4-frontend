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

const List = props => (
  <Wrapper>
    <Text size='16px' weight={500} capitalize>
      <FormattedMessage id='scenes.exchangehistory.exchanges' defaultMessage='Completed exchanges' />
    </Text>
    <History>
      <HistoryHeader>
        <HistoryCell width='15%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.status' defaultMessage='Status' />
          </Text>
        </HistoryCell>
        <HistoryCell width='15%' />
        <HistoryCell width='30%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.date' defaultMessage='Date' />
          </Text>
        </HistoryCell>
        <HistoryCell width='20%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.exchanged' defaultMessage='Exchanged' />
          </Text>
        </HistoryCell>
        <HistoryCell width='20%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.received' defaultMessage='Received' />
          </Text>
        </HistoryCell>
      </HistoryHeader>
      {props.trades.map((trade, index) => (
        <HistoryRow key={index}>
          <HistoryCell width='15%'>
            <OrderStatus status={trade.status} />
          </HistoryCell>
          <HistoryCell width='15%'>
            <Link size='14px' weight={300} capitalize>
              <FormattedMessage id='scenes.exchangehistory.details' defaultMessage='View details' />
            </Link>
          </HistoryCell>
          <HistoryCell width='30%'>
            <Text size='14px' weight={300}>{trade.date}</Text>
          </HistoryCell>
          <HistoryCell width='20%'>
            <Text size='14px' weight={300}>0.05633931 ETH</Text>
          </HistoryCell>
          <HistoryCell width='20%'>
            <Text size='14px' weight={300}>0.00123241 BTC</Text>
          </HistoryCell>
        </HistoryRow>
      ))}
    </History>
  </Wrapper>
)

List.propTypes = {
  trades: PropTypes.array
}

List.defaultProps = {
  trades: []
}

export default List
