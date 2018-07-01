import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { TableCell, TableRow, Text, Link } from 'blockchain-info-components'
import OrderStatus from './OrderStatus'
import media from 'services/ResponsiveService'

const StatusContainer = styled(TableCell)`
  display: flex;
  ${media.mobile`
    flex-direction: column;
    width: 25%;
  `}
`

const tradeDateHelper = (date, isMobile) => {
  let timeFormat = 'MMMM D YYYY @ h:mm A'
  if (isMobile) timeFormat = 'DD MMM'
  return moment(date).local().format(timeFormat)
}

const TradeItem = props => {
  const { status, date, sourceCoin, targetCoin, depositAmount, withdrawalAmount, handleClick } = props
  const isMobile = window.outerWidth <= 480

  return (
    <TableRow>
      <StatusContainer width='30%' mobileWidth='25%'>
        <TableCell width='30%'>
          <OrderStatus status={status} size={isMobile ? '12px' : '14px'} />
        </TableCell>
        <TableCell width='70%'>
          <Link size={isMobile ? '12px' : '14px'} weight={300} capitalize onClick={handleClick}>
            <FormattedMessage id='scenes.exchangehistory.list.tradeitem.viewdetails' defaultMessage='View details' />
          </Link>
        </TableCell>
      </StatusContainer>
      <TableCell width='30%' mobileWidth='18%'>
        <Text size={isMobile ? '12px' : '14px'} weight={300}>{tradeDateHelper(date, isMobile)}</Text>
      </TableCell>
      <TableCell width='20%' mobileWidth='30%'>
        <Text size={isMobile ? '12px' : '14px'} weight={300}>{`${depositAmount} ${sourceCoin}`}</Text>
      </TableCell>
      <TableCell width='20%'>
        <Text size={isMobile ? '12px' : '14px'} weight={300} color={status === 'complete' ? 'gray-5' : 'gray-2'}>{`${withdrawalAmount} ${targetCoin}`}</Text>
      </TableCell>
    </TableRow>
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
