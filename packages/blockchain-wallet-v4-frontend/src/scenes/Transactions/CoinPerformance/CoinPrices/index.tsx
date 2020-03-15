import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { buildPercentageChange } from '../../model'
import { connect } from 'react-redux'
import { CurrenciesType } from 'core/exchange/currencies'
import { Exchange } from 'blockchain-wallet-v4/src'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { RemoteDataType } from 'core/types'
import { SkeletonRectangle, Text } from 'blockchain-info-components'
import { Skeletons } from '../../WalletBalanceDropdown/template.loading'
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
  white-space: nowrap;
  color: ${props => props.theme.grey600};
`
const PriceChangeColoredText = styled.span<{ priceChange: number }>`
  font-weight: 600;
  color: ${props =>
    props.priceChange >= 0 ? props.theme.green400 : props.theme.red500};
`

type SuccessStateType = {
  currency: keyof CurrenciesType
  currencySymbol: string
  priceChange: number
  priceCurrent: number
  pricePercentageChange: number
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = LinkStatePropsType

class CoinPricesContainer extends React.PureComponent<Props> {
  render () {
    const { data } = this.props

    return data.cata({
      Success: val => {
        const {
          currency,
          currencySymbol,
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
              {currencySymbol}
              {Currency.formatFiat(priceCurrent)}
            </PriceText>
            <PriceChangeText>
              <PriceChangeColoredText priceChange={priceChange}>
                {buildPercentageChange(
                  currencySymbol,
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
      Failure: e => <Text>{typeof e === 'string' ? e : 'Unknown Error'}</Text>,
      Loading: () => <Skeletons />,
      NotAsked: () => <Skeletons />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

export default connect(mapStateToProps)(CoinPricesContainer)
