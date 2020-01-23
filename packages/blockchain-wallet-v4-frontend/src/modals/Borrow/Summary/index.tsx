import {
  coinToString,
  fiatToString
} from 'blockchain-wallet-v4/src/exchange/currency'
import { FormattedMessage } from 'react-intl'
import { OfferType, RatesType } from 'data/types'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

type Props = {
  collateral: number
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
  border-top: 1px solid ${props => props.theme.grey000};
  &:last-child {
    border-bottom: 1px solid ${props => props.theme.grey000};
  }
`

const Title = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.grey600};
`

const Value = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
`

const Summary: React.FC<Props> = props => {
  const rate = props.rates[props.offer.terms.principalCcy]
    ? props.rates[props.offer.terms.principalCcy].last
    : props.rates['USD'].last

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
            {props.principal || 0} {props.offer.terms.principalCcy}
          </Value>
        </Row>
        <Row>
          <Title>
            {props.offer.terms.collateralCcy} to{' '}
            {props.offer.terms.principalCcy} Rate
          </Title>
          <Value>
            {rate} {props.offer.terms.principalCcy}
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
              ? props.offer.terms.interestRate * Number(props.principal)
              : 0}{' '}
            {props.offer.terms.principalCcy}
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
      </Table>
    </div>
  )
}

export default Summary
