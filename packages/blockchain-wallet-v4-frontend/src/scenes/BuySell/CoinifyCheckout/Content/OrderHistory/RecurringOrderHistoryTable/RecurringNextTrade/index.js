import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Exchange } from 'blockchain-wallet-v4/src'
import { prop } from 'ramda'
import moment from 'moment'
import { RecurringTableRow } from '../components'
import {
  TableCell,
  Text
} from 'blockchain-info-components'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import media from 'services/ResponsiveService'

const StatusContainer = styled(TableCell)`
  display: flex;
  flex-basis: 30%;
  ${media.mobile`
    flex-direction: column;
  `};
`

const tradeDateHelper = (trade, frequency, isMobile) => {
  const freq = frequency === 'weekly' ? 'week' : 'month'
  return moment(prop('createdAt', trade))
    .local()
    .add(1, freq)
    .format(isMobile ? 'DD MMM' : 'MMMM D YYYY @ h:mm A')
}

const RecurringNextTrade = props => {
  const {
    border,
    conversion,
    frequency,
    padding,
    trade
  } = props
  const exchangeAmount = trade.isBuy
    ? Exchange.displayFiatToFiat({ value: trade.sendAmount / conversion.buy })
    : trade.sendAmount / conversion.sell

  return (
    <RecurringTableRow border={border} padding={padding}>
      <StatusContainer>
        <TableCell width='50%'>
          <Text />
        </TableCell>
        <TableCell width='40%'>
          <Text size='12px' weight={300} opacity={0.5}>
            <FormattedMessage id='buysell.orderhistory.recurring.nexttrade.nextscheduled' defaultMessage='Next Scheduled' />
          </Text>
        </TableCell>
      </StatusContainer>
      <TableCell width='30%' mobileWidth='20%'>
        <MediaContextConsumer>
          {({ mobile }) => (
            <Text
              opacity={0.5}
              size='13px'
              weight={300}
            >
              {tradeDateHelper(trade, frequency, mobile)}
            </Text>
          )}
        </MediaContextConsumer>
      </TableCell>
      <TableCell width='20%' mobileWidth='25%'>
        <Text
          opacity={0.5}
          size='13px'
          weight={300}
        >{`${exchangeAmount} ${trade.inCurrency}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <TableCell width='80%'>
          <Text
            opacity={0.5}
            size='13px'
            weight={300}
          >
            <FormattedMessage id='buysell.orderhistory.recurring.nexttrade.pending' defaultMessage='pending' />
          </Text>
        </TableCell>
        <TableCell width='20%' />
      </TableCell>
    </RecurringTableRow>
  )
}

RecurringNextTrade.propTypes = {
  trade: PropTypes.object.isRequired
}

export default RecurringNextTrade
