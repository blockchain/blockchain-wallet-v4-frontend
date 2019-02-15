import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { prop, path, sortBy, reverse, head } from 'ramda'
import moment from 'moment'
import RecurringTradeItem from '../RecurringTrade'
import media from 'services/ResponsiveService'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import { RecurringTableHeader } from '../components'
import {
  TableCell,
  TableRow,
  Text,
  Link,
  Icon,
  Button
} from 'blockchain-info-components'

const ToggleIcon = styled(Icon)`
  cursor: pointer;
  transform: rotate(-90deg);
  transition: transform 0.3s;
  transform: ${props => props.toggled && 'rotate(0deg)'};
  ${media.mobile`
    display: none;
  `};
`
const Frequency = styled(Text)`
  text-transform: capitalize;
`
const RecurringTableWrapper = styled.div`
  width: calc(100% - 22px);
  padding: 5px 10px;
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-right: 1px solid ${props => props.theme['gray-2']};
  padding-bottom: 30px;
`
const RecurringCancelWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`
const StatusText = styled(Text)`
  margin-left: 10px;
  ${media.mobile`
    margin-left: 0px;
  `};
`
const StatusContainer = styled(TableCell)`
  display: flex;
  flex-basis: 30%;
  ${media.mobile`
    flex-direction: column;
    width: 25%;
  `};
`
const dateHelper = (date, isMobile) =>
  moment(date)
    .local()
    .format(isMobile ? 'DD MMM' : 'MMMM D YYYY')

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
    const {
      subscription,
      handleCancelSubscription,
      matchedTrades,
      conversion,
      handleFinishTrade,
      handleDetailsClick,
      handleTradeCancel,
      status,
      cancelTradeId,
      canTrade
    } = this.props
    const sortByCreated = sortBy(prop('createdAt'))
    const sortedTrades = reverse(sortByCreated(matchedTrades))
    const firstTrade = head(sortByCreated(matchedTrades))

    return (
      <Fragment>
        <MediaContextConsumer>
          {({ mobile }) => (
            <TableRow>
              <StatusContainer mobileWidth='35%'>
                <TableCell onClick={this.toggleRow} width='35%'>
                  <ToggleIcon name='down-arrow' toggled={this.state.toggled} />
                  <StatusText
                    color={prop('isActive', subscription) ? 'success' : 'error'}
                    size='13px'
                    weight={300}
                  >
                    {prop('isActive', subscription) ? (
                      <FormattedMessage
                        id='scenes.buysell.orderhistory.recurring.order.active'
                        defaultMessage='Active'
                      />
                    ) : (
                      <FormattedMessage
                        id='scenes.buysell.orderhistory.recurring.order.inactive'
                        defaultMessage='Inactive'
                      />
                    )}
                  </StatusText>
                </TableCell>
                <TableCell width='50%'>
                  <Link size='13px' weight={400} onClick={this.toggleRow}>
                    {mobile ? (
                      <FormattedMessage
                        id='scenes.buysell.orderhistory.recurring.order.manage2'
                        defaultMessage='Manage'
                      />
                    ) : (
                      <FormattedMessage
                        id='scenes.buysell.orderhistory.recurring.order.manage'
                        defaultMessage='Manage This Order'
                      />
                    )}
                  </Link>
                </TableCell>
              </StatusContainer>
              <TableCell width='30%'>
                <Frequency size='13px' weight={300}>
                  {path(['frequency'], subscription)}
                </Frequency>
              </TableCell>
              <TableCell width='20%'>
                {dateHelper(prop('createdAt', firstTrade), mobile)}
              </TableCell>
              <TableCell width='20%'>
                <TableCell width='100%'>
                  {!path(['endTime'], subscription) ? (
                    <FormattedMessage
                      id='scenes.buysell.orderhistory.recurring.order.untilcancel'
                      defaultMessage='Until you cancel'
                    />
                  ) : (
                    dateHelper(prop('endTime', subscription), mobile)
                  )}
                </TableCell>
              </TableCell>
            </TableRow>
          )}
        </MediaContextConsumer>
        {this.state.toggled ? (
          <RecurringTableWrapper>
            <RecurringTableHeader
              padding='8px 5px'
              backgroundColor='white-blue'
            >
              <TableCell width='15%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.buysell.orderhistory.recurring.status'
                    defaultMessage='Status'
                  />
                </Text>
              </TableCell>
              <TableCell width='15%' />
              <TableCell width='30%' mobileWidth='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.buysell.orderhistory.recurring.date'
                    defaultMessage='Date'
                  />
                </Text>
              </TableCell>
              <TableCell width='20%' mobileWidth='25%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.buysell.orderhistory.recurring.exchanged'
                    defaultMessage='Exchanged'
                  />
                </Text>
              </TableCell>
              <TableCell width='20%'>
                <Text size='13px' weight={500} capitalize>
                  <FormattedMessage
                    id='scenes.buysell.orderhistory.recurring.received'
                    defaultMessage='Received'
                  />
                </Text>
              </TableCell>
            </RecurringTableHeader>
            {sortedTrades.map((trade, index) => (
              <RecurringTradeItem
                key={index}
                trade={trade}
                conversion={conversion}
                handleFinish={handleFinishTrade}
                handleClick={handleDetailsClick}
                handleTradeCancel={handleTradeCancel}
                status={status}
                cancelTradeId={cancelTradeId}
                canTrade={canTrade}
              />
            ))}
            {prop('isActive', subscription) ? (
              <RecurringCancelWrapper>
                <Button
                  nature='warning'
                  onClick={() => handleCancelSubscription(subscription)}
                >
                  <Text size='13px' weight={300} color='white'>
                    <FormattedMessage
                      id='scenes.buysell.orderhistory.recurring.cancelorder'
                      defaultMessage='Cancel Recurring Order'
                    />
                  </Text>
                </Button>
              </RecurringCancelWrapper>
            ) : null}
          </RecurringTableWrapper>
        ) : null}
      </Fragment>
    )
  }
}

RecurringOrder.propTypes = {
  trade: PropTypes.object.isRequired
}

export default RecurringOrder
