import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { model } from 'data'
import { TableCell, TableRow, Text, Link } from 'blockchain-info-components'
import { selectColor, OrderStatus } from 'components/OrderStatus'
import media from 'services/ResponsiveService'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'

const StatusContainer = styled(TableCell)`
  display: flex;
  ${media.mobile`
    flex-direction: column;
    width: 25%;
  `};
`

const { FINISHED } = model.components.exchangeHistory.STATES

const tradeDateHelper = (date, isMobile = false) => {
  let timeFormat = 'MMMM D YYYY @ h:mm A'
  if (isMobile) timeFormat = 'DD MMM'
  return moment(date)
    .local()
    .format(timeFormat)
}

const TradeItem = props => {
  const {
    status,
    date,
    sourceCoin,
    targetCoin,
    depositAmount,
    withdrawalAmount,
    handleClick
  } = props

  return (
    <MediaContextConsumer>
      {({ mobile }) => (
        <TableRow>
          <StatusContainer width='30%' mobileWidth='25%'>
            <TableCell width='50%'>
              <Text
                weight={300}
                size={mobile ? '12px' : '14px'}
                capitalize
                color={selectColor(status)}
              >
                <OrderStatus status={status} />
              </Text>
            </TableCell>
            <TableCell width='50%'>
              <Link
                size={mobile ? '12px' : '14px'}
                weight={300}
                capitalize
                onClick={handleClick}
              >
                <FormattedMessage
                  id='scenes.exchangehistory.list.tradeitem.viewdetails'
                  defaultMessage='View details'
                />
              </Link>
            </TableCell>
          </StatusContainer>
          <TableCell width='30%' mobileWidth='18%'>
            <Text size={mobile ? '12px' : '14px'} weight={300}>
              {tradeDateHelper(date, mobile)}
            </Text>
          </TableCell>
          <TableCell width='20%' mobileWidth='30%'>
            <Text
              size={mobile ? '12px' : '14px'}
              weight={300}
            >{`${depositAmount} ${sourceCoin}`}</Text>
          </TableCell>
          <TableCell width='20%'>
            <Text
              size={mobile ? '12px' : '14px'}
              weight={300}
              color={
                status === 'complete' || status === FINISHED
                  ? 'gray-5'
                  : 'gray-2'
              }
            >{`${withdrawalAmount} ${targetCoin}`}</Text>
          </TableCell>
        </TableRow>
      )}
    </MediaContextConsumer>
  )
}

TradeItem.propTypes = {
  status: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  sourceCoin: PropTypes.string.isRequired,
  targetCoin: PropTypes.string.isRequired,
  depositAmount: PropTypes.string.isRequired,
  withdrawalAmount: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default TradeItem
