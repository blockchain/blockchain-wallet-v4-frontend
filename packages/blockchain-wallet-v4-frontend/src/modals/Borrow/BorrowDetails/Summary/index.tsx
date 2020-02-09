import { FormattedMessage } from 'react-intl'
import { LoanType } from 'core/types'
import { OwnProps, SuccessStateType } from '..'
import { Status } from 'blockchain-wallet-v4-frontend/src/scenes/Borrow/BorrowHistory/model'
import { TableRow, Title, Value } from 'components/Borrow'
import { Text } from 'blockchain-info-components'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

type Props = OwnProps & SuccessStateType

const Table = styled.div`
  margin-top: 16px;
`

const Summary: React.FC<Props> = props => {
  const principalDisplayName =
    props.supportedCoins[props.loan.principal.amount[0].symbol].displayName
  const offer = props.offers.find(offer => offer.id === props.loan.offerId)

  return (
    <div>
      <Text color='grey900' weight={600}>
        <FormattedMessage id='modals.borrow.summary' defaultMessage='Summary' />
      </Text>
      <Table>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.status'
              defaultMessage='Status'
            />
          </Title>
          <Value>
            <Status {...props.loan} />
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.borrowamount'
              defaultMessage='Borrow Amount'
            />
          </Title>
          <Value>
            {props.loan.principal.amount[0].value} {principalDisplayName}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.collateral'
              defaultMessage='Collateral'
            />
          </Title>
          <Value>
            {props.loan.collateral.amounts[0].value}{' '}
            {props.loan.collateral.amounts[0].symbol}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.collateralization'
              defaultMessage='Collateralization'
            />
          </Title>
          <Value>
            {Number(props.loan.collateralisationRatio * 100).toFixed(0)}%
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.interestrate'
              defaultMessage='Interest Rate'
            />
          </Title>
          <Value>
            {offer
              ? Number(offer.terms.interestRate * 100).toFixed(0) + '%'
              : '-'}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.expires'
              defaultMessage='Expires'
            />
          </Title>
          <Value>{moment(props.loan.expiration).format('lll')}</Value>
        </TableRow>
      </Table>
    </div>
  )
}

export default Summary
