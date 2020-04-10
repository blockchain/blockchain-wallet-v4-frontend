import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { connect } from 'react-redux'
import { CurrenciesType } from 'core/exchange/currencies'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { PriceChange } from '../../model'
import { RemoteDataType, SupportedCoinType } from 'core/types'
import { Skeletons } from '../../WalletBalanceDropdown/template.loading'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
`

type OwnProps = {
  coinModel: SupportedCoinType
}

type SuccessStateType = {
  currency: keyof CurrenciesType
  currencySymbol: string
  priceChangeFiat: number
  priceChangePercentage: number
  priceCurrent: number
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = LinkStatePropsType & OwnProps

class CoinPricesContainer extends React.PureComponent<Props> {
  render () {
    const { data } = this.props

    return data.cata({
      Success: val => {
        const { currencySymbol, priceCurrent } = val

        return (
          <Wrapper>
            <TitleText>
              <FormattedMessage
                id='scenes.transactions.performance.prices.price'
                defaultMessage='{account} Price'
                values={{ account: this.props.coinModel.coinTicker }}
              />
            </TitleText>
            <PriceText>
              {currencySymbol}
              {Currency.formatFiat(priceCurrent)}
            </PriceText>
            <PriceChange {...val}>
              {' '}
              <FormattedMessage
                id='scenes.transactions.performance.prices.week'
                defaultMessage='this week'
              />
            </PriceChange>
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
