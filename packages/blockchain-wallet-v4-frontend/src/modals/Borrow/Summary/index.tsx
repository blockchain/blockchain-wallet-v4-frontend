import {
  coinToString,
  fiatToString,
  formatFiat
} from 'blockchain-wallet-v4/src/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { OfferType, RatesType } from 'data/types'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

type Props = {
  collateral: number
  displayName: string
  offer: OfferType
  principal?: string
  rates: RatesType
}

const Table = styled.div`
  margin-top: 16px;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid ${props => props.theme.grey000};
  &:first-child {
    border-top: 1px solid ${props => props.theme.grey000};
  }
`

const Title = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey600};
`

const Value = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.grey800};
`

const ColValue = styled(Value)`
  margin-top: 6px;
`

const BottomRow = styled.div`
  display: flex;
  margin-top: 20px;
`
const Column = styled.div`
  width: 33.333%;
  border-left: 1px solid ${props => props.theme.grey000};
  &:first-child {
    border-left: 0;
  }
  &:nth-child(2) {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Summary: React.FC<Props> = props => {
  const rate = props.rates[props.offer.terms.principalCcy]
    ? props.rates[props.offer.terms.principalCcy].last
    : props.rates['USD'].last

  const principalDisplayName = props.displayName

  return (
    <div>
      <Text color='grey900' weight={600}>
        <FormattedMessage id='modals.borrow.summary' defaultMessage='Summary' />
      </Text>
      <Table>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.amount'
              defaultMessage='Borrow Amount'
            />
          </Title>
          <Value>
            {formatFiat(props.principal || 0)} {principalDisplayName}
          </Value>
        </Row>
        <Row>
          <Title>
            {props.offer.terms.collateralCcy} to {principalDisplayName} Rate
          </Title>
          <Value>
            {rate} {principalDisplayName}
          </Value>
        </Row>
        <Row>
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
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.borrow.summary.collateral'
              defaultMessage='Collateral'
            />
          </Title>
          <Value>
            {coinToString({
              value: props.principal
                ? (Number(props.principal) / rate) *
                  props.offer.terms.collateralRatio
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
        </Row>
        <BottomRow>
          <Column>
            <Title>
              <FormattedMessage
                id='modals.borrow.summary.collateralization'
                defaultMessage='Collateralization'
              />
            </Title>
            <ColValue>
              {(props.offer.terms.collateralRatio * 100).toFixed(0)}%
            </ColValue>
          </Column>
          <Column>
            <Title>
              <FormattedMessage
                id='modals.borrow.summary.loanterm'
                defaultMessage='Loan Term'
              />
            </Title>
            <ColValue>{props.offer.terms.format}</ColValue>
          </Column>
        </BottomRow>
      </Table>
    </div>
  )
}

export default Summary
