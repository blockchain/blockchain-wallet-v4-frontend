import { BorrowFormValuesType, RatesType } from 'data/types'
import {
  coinToString,
  fiatToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import { OfferType } from 'core/types'
import { TableRow, Title, Value } from 'components/Borrow'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

type Props = {
  collateral: number
  displayName: string
  offer: OfferType
  principal?: string
  rates: RatesType
  values: BorrowFormValuesType
}

const Table = styled.div`
  margin-top: 16px;
`

const { fiatDisplayName } = model.components.borrow

const Summary: React.FC<Props> = props => {
  const fiatName = fiatDisplayName(props.offer.terms.principalCcy)
  const principalDisplayName = props.displayName
  const rate = props.rates[fiatName].last

  return (
    <div>
      <Text color='grey900' weight={600}>
        <FormattedMessage id='modals.borrow.summary' defaultMessage='Summary' />
      </Text>
      <Table>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.amount'
              defaultMessage='Borrow Amount'
            />
          </Title>
          <Value>
            {formatFiat(props.principal || 0)} {principalDisplayName}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            {props.offer.terms.collateralCcy} to {fiatName} Rate
          </Title>
          <Value>
            {formatFiat(rate)} {fiatName}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.intrateandamount'
              defaultMessage='Interest Rate / Amount'
            />
          </Title>
          <Value>
            {props.offer.terms.interestRate * 100}% /{' '}
            {props.principal
              ? formatFiat(
                  props.offer.terms.interestRate * Number(props.principal)
                )
              : formatFiat(0)}{' '}
            {principalDisplayName}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.collateral'
              defaultMessage='Collateral'
            />
          </Title>
          <Value>
            {coinToString({
              value: props.values.collateralCryptoAmt
                ? props.values.collateralCryptoAmt
                : 0,
              unit: { symbol: props.offer.terms.collateralCcy }
            })}{' '}
            (
            {fiatToString({
              value: props.principal
                ? Number(props.principal) * props.offer.terms.collateralRatio
                : 0,
              unit: { symbol: '$' }
            })}
            )
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.collateralization'
              defaultMessage='Collateralization'
            />
          </Title>
          <Value>{(props.offer.terms.collateralRatio * 100).toFixed(0)}%</Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.loanterm'
              defaultMessage='Loan Term'
            />
          </Title>
          <Value>{props.offer.terms.format}</Value>
        </TableRow>
      </Table>
    </div>
  )
}

export default Summary
