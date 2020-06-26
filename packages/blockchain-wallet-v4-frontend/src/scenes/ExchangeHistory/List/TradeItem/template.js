import { FormattedMessage } from 'react-intl'
import { Link, TableCell, TableRow, Text } from 'blockchain-info-components'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import { model } from 'data'
import { OrderStatus, selectColor } from 'components/OrderStatus'
import { pathOr } from 'ramda'
import media from 'services/ResponsiveService'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const StatusContainer = styled(TableCell)`
  display: flex;
  ${media.mobile`
    flex-direction: column;
    width: 25%;
  `};
`

const { FINISHED } = model.components.exchangeHistory.STATES

const tradeDateHelper = (date, isMobile = false) =>
  moment(date)
    .local()
    .format(isMobile ? 'DD MMM' : 'MMMM D YYYY @ h:mm A')

const TradeItem = props => {
  const {
    coinModels,
    date,
    depositAmount,
    handleClick,
    sourceCoin,
    status,
    targetCoin,
    withdrawalAmount
  } = props

  return (
    <MediaContextConsumer>
      {({ mobile }) => (
        <TableRow dataE2e='exchangeHistoryOrderRow'>
          <StatusContainer width='30%' mobileWidth='25%'>
            <TableCell width='50%'>
              <Text
                weight={400}
                size={mobile ? '12px' : '14px'}
                capitalize
                color={selectColor(status)}
                data-e2e='exchangeHistoryOrderStatus'
              >
                <OrderStatus status={status} />
              </Text>
            </TableCell>
            <TableCell width='50%'>
              <Link
                size={mobile ? '12px' : '14px'}
                weight={400}
                capitalize
                onClick={handleClick}
                data-e2e='exchangeHistoryViewDetails'
              >
                <FormattedMessage
                  id='scenes.exchangehistory.list.tradeitem.viewdetails'
                  defaultMessage='View details'
                />
              </Link>
            </TableCell>
          </StatusContainer>
          <TableCell width='30%' mobileWidth='18%'>
            <Text
              size={mobile ? '12px' : '14px'}
              weight={400}
              data-e2e='exchangeHistoryOrderDate'
            >
              {tradeDateHelper(date, mobile)}
            </Text>
          </TableCell>
          <TableCell width='20%' mobileWidth='30%'>
            <Text
              data-e2e='exchangeHistoryOrderSource'
              size={mobile ? '12px' : '14px'}
              weight={400}
            >{`${depositAmount} ${pathOr(
              sourceCoin,
              [sourceCoin, 'coinTicker'],
              coinModels
            )}`}</Text>
          </TableCell>
          <TableCell width='20%'>
            <Text
              data-e2e='exchangeHistoryOrderTarget'
              size={mobile ? '12px' : '14px'}
              weight={400}
              color={
                status === 'complete' || status === FINISHED
                  ? 'grey700'
                  : 'grey200'
              }
            >{`${withdrawalAmount} ${pathOr(
              targetCoin,
              [targetCoin, 'coinTicker'],
              coinModels
            )}`}</Text>
          </TableCell>
        </TableRow>
      )}
    </MediaContextConsumer>
  )
}

TradeItem.propTypes = {
  coinModels: PropTypes.object.isRequired,
  status: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  sourceCoin: PropTypes.string.isRequired,
  targetCoin: PropTypes.string.isRequired,
  depositAmount: PropTypes.string.isRequired,
  withdrawalAmount: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default TradeItem
