import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  padding: 30px;
  border: 1px solid ${props => props.theme['gray-2']}};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const SummaryText = styled(Text)`
  font-size: 14px;
  line-height: 17px;
`
const Title = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 24px;
`
const AmountHeader = styled(SummaryText)`
  margin-bottom: 8px;
`
const ExchangeAmount = styled(Text)`
  font-weight: 300;
  font-size: 20px;
  line-height: 24px;
  color: ${props => props.theme['brand-primary']};
  margin-bottom: 24px;
`
const Delimiter = styled.div`
  border-bottom: 1px solid ${props => props.theme['gray-2']}};
  width: 100%;
  margin-top: 6px;
  margin-bottom: 25px;
`
const TableRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 16px;
`
const Note = styled(Text)`
  font-size: 12px;
  line-height: 14px;
  margin-top: 12px;
  margin-bottom: 28px;
`
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
const RatesRow = styled(SummaryText)`
  text-align: center;
  margin-bottom: 16px;
`
const RatesTitle = styled(RatesRow)`
  font-weight: 600;
  margin-bottom: 12px;
`

const Summary = ({
  sourceAmount,
  targetAmount,
  value,
  sourceCoin,
  targetCoin,
  currency,
  fee,
  targetFiat,
  sourceToTargetRate,
  sourceToFiatRate,
  targetToFiateRate
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
        defaultMessage='Deposit'
      />
      &nbsp;
      {sourceCoin}
    </AmountHeader>
    <ExchangeAmount>
      {sourceAmount}
      &nbsp;
      {sourceCoin}
    </ExchangeAmount>
    <AmountHeader>
      <FormattedMessage
        id='scenes.exchange.exchangeform.summary.receive'
        defaultMessage='Receive'
      />
      &nbsp;
      {targetCoin}
    </AmountHeader>
    <ExchangeAmount>
      {targetAmount}
      &nbsp;
      {targetCoin}
    </ExchangeAmount>
    <Delimiter />
    <TableRow>
      <SummaryText>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.fee'
          defaultMessage='Network Fee'
        />
      </SummaryText>
      <SummaryText weight={300}>
        {fee}
        &nbsp;
        {targetCoin}
      </SummaryText>
    </TableRow>
    <TableRow>
      <SummaryText>
        <FormattedMessage
          id='scenes.exchange.exchangeform.summary.value'
          defaultMessage='~ Total Value'
        />
      </SummaryText>
      <SummaryText weight={300}>
        {value}
        &nbsp;
        {currency}
      </SummaryText>
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
        1&nbsp;
        {sourceCoin}
        &nbsp;=&nbsp;
        {sourceToTargetRate}
        &nbsp;
        {targetCoin}
      </RatesRow>
      <RatesRow>
        1&nbsp;
        {sourceCoin}
        &nbsp;=&nbsp;
        {sourceToFiatRate}
        &nbsp;
        {currency}
      </RatesRow>
      <RatesRow>
        1&nbsp;
        {targetCoin}
        &nbsp;=&nbsp;
        {targetToFiateRate}
        &nbsp;
        {currency}
      </RatesRow>
    </RatesWrapper>
  </Wrapper>
)

export default Summary
