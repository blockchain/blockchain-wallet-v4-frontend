import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { connect } from 'react-redux'
import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import { SkeletonRectangle, Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import { getData } from './selectors'

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
const LoadingWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
const Loading = () => (
  <LoadingWrapper>
    <SkeletonRectangle width='100px' height='20px' />
    <SkeletonRectangle width='100px' height='16px' />
    <SkeletonRectangle width='100px' height='16px' />
  </LoadingWrapper>
)
const PriceChangeText = styled(Text)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  color: ${props => props.theme.grey600};
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

class CoinPricesContainer extends React.PureComponent {
  render () {
    const { data } = this.props

    return data.cata({
      Success: val => {
        const {
          currency,
          priceChange,
          priceCurrent,
          pricePercentageChange
        } = val
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
                {buildPercentageChange(
                  currency,
                  priceChange,
                  pricePercentageChange
                )}
              </PriceChangeColoredText>{' '}
              <FormattedMessage
                id='scenes.transactions.performance.prices.week'
                defaultMessage='this week'
              />
            </PriceChangeText>
          </Wrapper>
        )
      },
      Failure: () => <Loading />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(CoinPricesContainer)
