import React from 'react'
import RecurringOrder from './RecurringOrder'
import { FormattedMessage } from 'react-intl'
import { Table, TableCell, TableHeader, Text } from 'blockchain-info-components'

class RecurringOrderHistoryTable extends React.PureComponent {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    const { subscriptions, cancelSubscription, trades, ...rest } = this.props
    // console.log('RecurringOrderHistoryTable', subscriptions)
    return (
      <Table>
        <TableHeader>
          <TableCell width='15%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.recurring.order' defaultMessage='Recurring Order' />
            </Text>
          </TableCell>
          <TableCell width='15%' />
          <TableCell width='30%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.recurring.frequency' defaultMessage='Frequency' />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.recurring.start' defaultMessage='Start' />
            </Text>
          </TableCell>
          <TableCell width='20%'>
            <Text size='13px' weight={500} capitalize>
              <FormattedMessage id='scenes.buysell.orderhistory.recurring.end' defaultMessage='End' />
            </Text>
          </TableCell>
        </TableHeader>
        {subscriptions.map((subscription, index) => <RecurringOrder // list of all recurring orders, trades will be inside these
          {...rest}
          key={index}
          subscription={subscription}
          cancelSubscription={cancelSubscription}
          matchedTrades={trades.filter(t => t.tradeSubscriptionId === subscription.id)}
        />)}
      </Table>
    )
  }
}

export default RecurringOrderHistoryTable
