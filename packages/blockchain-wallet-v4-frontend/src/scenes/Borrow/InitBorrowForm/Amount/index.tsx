import { CoinType, OfferType, RemoteDataType } from 'core/types'
import { connect } from 'react-redux'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { getBalance } from './selectors'
import { RatesType } from 'data/types'
import { RootState } from 'data/rootReducer'
import { Text } from 'blockchain-info-components'
import React, { Component } from 'react'
import styled from 'styled-components'

type OwnProps = {
  coin: CoinType
}

type LinkStatePropsType = {
  data: RemoteDataType<
    Error | string,
    {
      balance: number
      max: number
      offer: OfferType
      offers: Array<OfferType>
      rates: RatesType
      values: { coin: CoinType }
    }
  >
}

type Props = OwnProps & LinkStatePropsType

const Wrapper = styled.div`
  margin-top: 8px;
`

const Content = styled(Text)`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
`

export class Amount extends Component<Props> {
  state = {}

  render () {
    return (
      <Wrapper>
        {this.props.data.cata({
          Success: val => (
            <Text weight={600} size='32px'>
              {fiatToString({
                unit: 'USD',
                value: val.offer
                  ? Math.min(
                      Exchange.convertCoinToFiat(
                        convertBaseToStandard(val.values.coin, val.max),
                        val.values.coin,
                        'USD',
                        val.rates
                      ),
                      Number(
                        convertBaseToStandard(
                          val.offer.terms.maxPrincipalAmount.currency,
                          val.offer.terms.maxPrincipalAmount.amount
                        )
                      )
                    )
                  : 0
              })}
            </Text>
          ),
          Failure: e => {
            return (
              <Content>
                {typeof e === 'object' ? (e.message ? e.message : 'N/A') : e}
              </Content>
            )
          },
          NotAsked: () => <Content>...</Content>,
          Loading: () => <Content>...</Content>
        })}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getBalance(state)
})

export default connect(mapStateToProps)(Amount)
