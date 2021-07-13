import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { SupportedCoinType } from 'blockchain-wallet-v4/src/types'

import { PriceChange } from '../../model'
import { Skeletons } from '../../WalletBalanceDropdown/template.loading'
import { getData } from './selectors'

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

class CoinPricesContainer extends React.PureComponent<Props> {
  render() {
    const { data } = this.props

    return data.cata({
      Success: val => {
        const { priceChange } = val

        return (
          <Wrapper>
            <TitleText>
              <FormattedMessage
                id='scenes.transactions.performance.account.price'
                defaultMessage='{account} Price'
                values={{ account: this.props.coinModel.coinTicker }}
              />
            </TitleText>
            <PriceText>
              {fiatToString({
                value: priceChange.currentPrice,
                unit: val.currency
              })}
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

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, ownProps)
})

const connector = connect(mapStateToProps)

export type OwnProps = {
  coinModel: SupportedCoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(CoinPricesContainer)
