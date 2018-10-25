import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { BigNumber } from 'bignumber.js'

import StringDisplay from 'components/Display/StringDisplay'
import {
  Wrapper,
  ExchangeText,
  ExchangeAmount,
  Title,
  AmountHeader,
  Delimiter,
  TableRow,
  Note
} from 'components/Exchange'

const RatesWrapper = styled.div`
  padding-top: 17px;
  padding-bottom: 4px;
  background-color: ${props => props.theme['white-blue']};
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`
const RatesRow = styled(ExchangeText)`
  text-align: center;
  margin-bottom: 16px;
`
const RatesTitle = styled(RatesRow)`
  font-weight: 400;
  margin-bottom: 12px;
`

const add = (augend, addend) => new BigNumber(augend).add(addend).toString()

const Summary = ({
  sourceCoin,
  targetCoin,
  currency,
  sourceFee,
  sourceAmount,
  targetAmount,
  targetFiat,
  sourceToTargetRate,
  sourceToFiatRate,
  targetToFiatRate
}) => (
  <Wrapper>
    <Title>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.title'
        defaultMessage='Summary'
      />
    </Title>
    <AmountHeader>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.deposit'
        defaultMessage='Exchange {coin}'
        values={{
          coin: sourceCoin
        }}
      />
    </AmountHeader>
    <ExchangeAmount>
      <StringDisplay>
        {sourceAmount.map(
          amount => `${add(amount, sourceFee.source)} ${sourceCoin}`
        )}
      </StringDisplay>
    </ExchangeAmount>
    <AmountHeader>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.receive'
        defaultMessage='Receive {coin}'
        values={{
          coin: targetCoin
        }}
      />
    </AmountHeader>
    <ExchangeAmount>
      <StringDisplay>
        {targetAmount.map(amount => `${amount} ${targetCoin}`)}
      </StringDisplay>
    </ExchangeAmount>
    <Delimiter />
    <TableRow>
      <ExchangeText>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.fee'
          defaultMessage='Network Fee'
        />
      </ExchangeText>
      <ExchangeText weight={300}>
        {`${sourceFee.source} ${sourceCoin}`}
      </ExchangeText>
    </TableRow>
    <TableRow>
      <ExchangeText>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.value'
          defaultMessage='~ Total Value'
        />
      </ExchangeText>
      <ExchangeText weight={300}>
        <StringDisplay>
          {targetFiat.map(amount => `${amount} ${currency}`)}
        </StringDisplay>
      </ExchangeText>
    </TableRow>
    <Note>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.note'
        defaultMessage='All amounts are correct at this time but may change depending on the market price and network congestion at the time of your transaction.'
      />
    </Note>
    <RatesWrapper>
      <RatesTitle>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.rates'
          defaultMessage='Rates'
        />
      </RatesTitle>
      <RatesRow>
        <StringDisplay>
          {sourceToTargetRate.map(
            rate => `1 ${sourceCoin} = ${rate} ${targetCoin}`
          )}
        </StringDisplay>
      </RatesRow>
      <RatesRow>
        <StringDisplay>
          {sourceToFiatRate.map(
            rate => `1 ${sourceCoin} = ${rate} ${currency}`
          )}
        </StringDisplay>
      </RatesRow>
      <RatesRow>
        <StringDisplay>
          {targetToFiatRate.map(
            rate => `1 ${targetCoin} = ${rate} ${currency}`
          )}
        </StringDisplay>
      </RatesRow>
    </RatesWrapper>
  </Wrapper>
)

export default Summary
