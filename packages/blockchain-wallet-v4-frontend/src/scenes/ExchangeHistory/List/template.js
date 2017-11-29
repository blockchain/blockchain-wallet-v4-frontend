import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { range } from 'ramda'
import { Link, Pagination, PaginationItem, Table, TableCell, TableHeader, TableRow, Text } from 'blockchain-info-components'
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
  const { trades, pageNumber, pageTotal, handleClick, handleClickPage } = props

  return (
    <Wrapper>
      <Text size='16px' weight={500} capitalize>
        <FormattedMessage id='scenes.exchangehistory.list.exchanges' defaultMessage='Completed exchanges' />
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
        {trades.map((trade, index) => {
          console.log(trade)
          return (
            <TableRow key={index}>
              <TableCell width='15%'>
                <OrderStatus status={trade.status} />
              </TableCell>
              <TableCell width='15%'>
                <Link size='14px' weight={300} capitalize onClick={() => handleClick(trade.address)}>
                  <FormattedMessage id='scenes.exchangehistory.list.details' defaultMessage='View details' />
                </Link>
              </TableCell>
              <TableCell width='30%'>
                <Text size='14px' weight={300}>{trade.date}</Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='14px' weight={300}>{`${trade.incomingCoin} ${trade.incomingType}`}</Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='14px' weight={300}>{`${trade.outgoingCoin} ${trade.outgoingType}`}</Text>
              </TableCell>
            </TableRow>
          )
        })}
      </Table>
      { pageTotal > 1 &&
        <Pagination>
          {range(1, pageTotal + 1).map(i => <PaginationItem key={i} selected={i === pageNumber} onClick={() => handleClickPage(i)}>{i}</PaginationItem>)}
        </Pagination>
      }
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
