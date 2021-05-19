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
  color: ${(props) => props.theme.grey800};
`

export class Amount extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render(): JSX.Element {
    return (
      <Wrapper>
        {this.props.data.cata({
          Failure: (e) => {
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
          Loading: () => <Content>...</Content>,
          NotAsked: () => <Content>...</Content>,
          Success: (val) => (
            <Text weight={600} size='32px'>
              {fiatToString({
                unit: 'USD',
                value: val.offer
                  ? Math.min(
                      Number(
                        Exchange.convertCoinToFiat({
                          coin: val.values.coin,
                          currency: 'USD',
                          isStandard: true,
                          rates: val.rates,
                          value: convertBaseToStandard(val.values.coin, val.max),
                        })
                      ),
                      Number(
                        convertBaseToStandard(
                          val.offer.terms.maxPrincipalAmount.currency,
                          val.offer.terms.maxPrincipalAmount.amount
                        )
                      )
                    )
                  : 0,
              })}
            </Text>
          ),
        })}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getBalance(state),
})

const connector = connect(mapStateToProps)

type OwnProps = {
  coin: CoinType
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Amount)
