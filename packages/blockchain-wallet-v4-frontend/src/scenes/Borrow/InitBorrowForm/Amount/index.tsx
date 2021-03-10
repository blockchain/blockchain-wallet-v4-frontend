import React, { Component } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { Exchange } from 'blockchain-wallet-v4/src'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { CoinType } from 'blockchain-wallet-v4/src/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'

import { getBalance } from './selectors'

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

  render() {
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
                {typeof e === 'object'
                  ? e.message
                    ? e.message === 'Unknown User'
                      ? 'N/A'
                      : e.message
                    : 'N/A'
                  : e}
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

const mapStateToProps = (state: RootState) => ({
  data: getBalance(state)
})

const connector = connect(mapStateToProps)

type OwnProps = {
  coin: CoinType
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Amount)
