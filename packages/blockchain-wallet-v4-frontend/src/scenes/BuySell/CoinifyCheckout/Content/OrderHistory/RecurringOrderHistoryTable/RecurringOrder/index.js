import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import moment from 'moment'
import { spacing } from 'services/StyleService'

import { TableCell, TableRow, Text, Link, Icon } from 'blockchain-info-components'
// import OrderStatus from '../OrderStatus'

const tradeDateHelper = (trade) => moment(prop('createdAt', trade)).local().format('MMMM D YYYY @ h:mm A')

const rotate90 = keyframes`
from {
  transform: rotate(0deg);
}

to {
  transform: rotate(90deg);
}
`

const ToggleIcon = styled(Icon)`
  animation: {rotate90} 2s linear infinite;
`

class RecurringOrder extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toggled: false }
    this.toggleRow = this.toggleRow.bind(this)
  }

  toggleRow () {
    this.setState({ toggled: !this.state.toggled })
  }

  render () {
    const { subscription } = this.props
    console.log('Recurring Order', this.props, this.state)
    return (
      <TableRow>
        <TableCell width='15%'>
          <ToggleIcon name='down-arrow' onClick={this.toggleRow} toggled={this.state.toggled} />
          <Text color={subscription.isActive ? 'success' : 'error'} size='13px' weight={300} style={spacing('ml-10')}>
            {
              subscription.isActive
                ? <FormattedMessage id='scenes.buysell.orderhistory.recurring.order.active' defaultMessage='Active' />
                : <FormattedMessage id='scenes.buysell.orderhistory.recurring.order.inactive' defaultMessage='Inactive' />
            }
          </Text>
        </TableCell>
        <TableCell width='15%'>
          <Link size='13px' weight={400} >
            <FormattedMessage id='scenes.buysell.orderhistory.recurring.order.manage' defaultMessage='Manage This Order' />
          </Link>
        </TableCell>
        <TableCell width='30%'>
          <Text size='13px' weight={300}>
            Daily/Weekly/Monthly
          </Text>
        </TableCell>
        <TableCell width='20%'>
          {/* <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{`${exchangeAmount} ${trade.inCurrency}`}</Text> */}
        </TableCell>
        <TableCell width='20%'>
          <TableCell width='80%'>
            {/* <Text opacity={trade.state === 'processing'} size='13px' weight={300}>{`${receiveAmount} ${trade.outCurrency}`}</Text> */}
          </TableCell>
          <TableCell width='20%' />
        </TableCell>
      </TableRow>
    )
  }
}

RecurringOrder.propTypes = {
  trade: PropTypes.object.isRequired
}

export default RecurringOrder
