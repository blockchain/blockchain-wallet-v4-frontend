import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text, TooltipHost, TooltipIcon } from 'blockchain-info-components'
import { coinToString, fiatToString, formatFiat } from 'blockchain-wallet-v4/src/exchange/utils'
import { OfferType, RatesType } from 'blockchain-wallet-v4/src/types'
import { BorrowFormValuesType } from 'data/types'

import { TableRow, Title, Value } from '../../components'

type Props = {
  collateral: number
  displayName: string
  offer: OfferType
  principal?: string
  rates: RatesType
  values?: BorrowFormValuesType
}

const Table = styled.div`
  margin-top: 16px;
`

const Summary: React.FC<Props> = (props) => {
  const principalDisplayName = props.displayName

  if (!props.values) return null

  return (
    <div>
      <Text color='grey800' weight={600}>
        <FormattedMessage id='modals.borrow.summary' defaultMessage='Summary' />
      </Text>
      <Table>
        <TableRow>
          <Title>
            <FormattedMessage id='modals.borrow.summary.amount' defaultMessage='Borrow Amount' />
          </Title>
          <Value data-e2e='borrowAmount'>
            {formatFiat(props.principal || 0)} {principalDisplayName}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.intrateandamount'
              defaultMessage='Interest Rate'
            />
          </Title>
          <Value data-e2e='interestRate'>
            {`${Number(props.offer.terms.interestRate * 100).toFixed(1)}%`}
          </Value>
        </TableRow>
        <TableRow>
          <Title>
            <FormattedMessage id='modals.borrow.summary.collateral' defaultMessage='Collateral' />
            <TooltipHost id='borrow.collateral.tooltip'>
              <TooltipIcon name='question-in-circle-filled' />
            </TooltipHost>
          </Title>
          <Value data-e2e='collateralAmount'>
            {coinToString({
              unit: { symbol: props.offer.terms.collateralCcy },
              value: props.values.collateralCryptoAmt ? props.values.collateralCryptoAmt : 0,
            })}{' '}
            (
            {fiatToString({
              unit: 'USD',
              value: props.principal
                ? Number(props.principal) * props.offer.terms.collateralRatio
                : 0,
            })}
            )
          </Value>
        </TableRow>
      </Table>
    </div>
  )
}

export default Summary
