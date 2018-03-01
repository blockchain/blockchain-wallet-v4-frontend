import React from 'react'
import styled from 'styled-components'
import TradeItem from './TradeItem'
import { FormattedMessage } from 'react-intl'
import { Table, TableCell, TableHeader, Text } from 'blockchain-info-components'

class OrderHistory extends React.Component {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    const { conversion, trades } = this.props

    return (
      <Table>
        <TableHeader>
          <TableCell width='15%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.orderhistory.list.status' defaultMessage='Status' />
            </Text>
          </TableCell>
          <TableCell width='15%' />
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.orderhistory.list.date' defaultMessage='Date' />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.orderhistory.list.exchanged' defaultMessage='Exchanged' />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.orderhistory.list.received' defaultMessage='Received' />
            </Text>
          </TableCell>
        </TableHeader>
        {trades.map((trade, index) => <TradeItem key={index} trade={trade} conversion={conversion} />)}
      </Table>
    )
  }
}

export default OrderHistory
