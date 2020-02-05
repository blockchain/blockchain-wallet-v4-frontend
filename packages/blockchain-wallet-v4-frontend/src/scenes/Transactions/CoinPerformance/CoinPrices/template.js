import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TitleText = styled(Text)`
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: ${props => props.theme.grey400};
`
const PriceText = styled(Text)`
  font-weight: 500;
  font-size: 24px;
  line-height: 135%;
  color: ${props => props.theme.grey800};
  margin: 5px 0;
`
const PriceChangeText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.grey400};
`
const PriceChangeColoredText = styled.span`
  font-weight: 600;
  color: ${props =>
    props.priceChange >= 0 ? props.theme.green400 : props.theme.red500};
`

const buildPercentageChange = (
  currency,
  priceChange,
  pricePercentageChange
) => {
  let priceFormatted
  if (priceChange < 0) {
    priceFormatted = `-${Exchange.getSymbol(currency)}${Currency.formatFiat(
      priceChange
    ).substring(1)}`
  } else {
    priceFormatted =
      Exchange.getSymbol(currency) + Currency.formatFiat(priceChange)
  }
  return `${priceFormatted} (${Currency.formatFiat(pricePercentageChange)}%)`
}

const CoinPrices = ({
  currency,
  priceChange,
  pricePercentageChange,
  priceCurrent
}) => {
  return (
    <Wrapper>
      <TitleText>
        <FormattedMessage
          id='scenes.transactions.performance.prices.price'
          defaultMessage='Current Price'
        />
      </TitleText>
      <PriceText>
        {Exchange.getSymbol(currency)}
        {Currency.formatFiat(priceCurrent)}
      </PriceText>
      <PriceChangeText>
        <PriceChangeColoredText priceChange={priceChange}>
          {buildPercentageChange(currency, priceChange, pricePercentageChange)}
        </PriceChangeColoredText>{' '}
        <FormattedMessage
          id='scenes.transactions.performance.prices.week'
          defaultMessage='this week'
        />
      </PriceChangeText>
    </Wrapper>
  )
}

export default CoinPrices
