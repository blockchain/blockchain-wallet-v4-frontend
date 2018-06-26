import React from 'react'
import TradeItem from './TradeItem'
import { FormattedMessage } from 'react-intl'
import { filter, prop, reverse, sortBy } from 'ramda'
import { Table, TableCell, TableHeader, Text } from 'blockchain-info-components'

class OrderHistoryTable extends React.PureComponent {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    const { conversion, trades, handleTradeCancel, handleFinishTrade, handleDetailsClick, status, cancelTradeId, canTrade } = this.props

    const isValid = (t) => t.createdAt
    const validTrades = filter(isValid, trades)
    const sortByCreated = sortBy(prop('createdAt'))
    const sortedTrades = reverse(sortByCreated(validTrades))

    return (
      <Table>
        <TableHeader>
          <TableCell width='15%' mobileWidth='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.list.status' defaultMessage='Status' />
            </Text>
          </TableCell>
          <TableCell width='15%' />
          <TableCell width='30%' mobileWidth='20%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.list.date' defaultMessage='Date' />
            </Text>
          </TableCell>
          <TableCell width='20%' hideMobile>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.list.exchanged' defaultMessage='Exchanged' />
            </Text>
          </TableCell>
          <TableCell width='20%' mobileWidth='35%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.list.received' defaultMessage='Received' />
            </Text>
          </TableCell>
        </TableHeader>
        {sortedTrades.map((trade, index) => <TradeItem
          key={index}
          trade={trade}
          conversion={conversion}
          handleFinish={handleFinishTrade}
          handleClick={handleDetailsClick}
          handleTradeCancel={handleTradeCancel}
          status={status}
          cancelTradeId={cancelTradeId}
          canTrade={canTrade}
        />)}
      </Table>
    )
  }
}

export default OrderHistoryTable
