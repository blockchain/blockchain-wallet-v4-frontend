import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Table, TableCell, TableHeader, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
import TradeItem from './TradeItem'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 30px;
  box-sizing: border-box;

  & > :first-child { margin-bottom: 20px; }
`

const List = props => (
  <Wrapper>
    <Table>
      <TableHeader >
        <TableCell width='15%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.status' defaultMessage='Status' />
          </Text>
        </TableCell>
        <TableCell width='15%' />
        <TableCell width='30%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.date' defaultMessage='Date' />
          </Text>
        </TableCell>
        <TableCell width='20%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.exchanged' defaultMessage='Exchanged' />
          </Text>
        </TableCell>
        <TableCell width='20%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.received' defaultMessage='To Be Received' />
          </Text>
        </TableCell>
      </TableHeader>
      {props.trades.incomplete.map((trade, index) => <TradeItem key={index} trade={trade} />)}
    </Table>
    <Text style={spacing('mb-15')} size='16px' weight={500} capitalize>
      <FormattedMessage padding-bottom='10px' id='scenes.exchangehistory.list.exchanges' defaultMessage='Completed Exchanges' />
    </Text>
    <Table>
      <TableHeader>
        <TableCell width='15%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.status' defaultMessage='Status' />
          </Text>
        </TableCell>
        <TableCell width='15%' />
        <TableCell width='30%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.date' defaultMessage='Date' />
          </Text>
        </TableCell>
        <TableCell width='20%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.exchanged' defaultMessage='Exchanged' />
          </Text>
        </TableCell>
        <TableCell width='20%'>
          <Text size='13px' weight={500} capitalize>
            <FormattedMessage id='scenes.exchangehistory.list.received' defaultMessage='Received' />
          </Text>
        </TableCell>
      </TableHeader>
      {props.trades.complete.map((trade, index) => <TradeItem key={index} trade={trade} />)}
    </Table>
  </Wrapper>
)

List.propTypes = {
  trades: PropTypes.shape({
    complete: PropTypes.array,
    incomplete: PropTypes.array
  })
}

List.defaultProps = {
  trades: {
    complete: [],
    incomplete: []
  }
}

export default List
