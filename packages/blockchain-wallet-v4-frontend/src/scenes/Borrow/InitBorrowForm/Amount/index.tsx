import { CoinType, OfferType } from 'blockchain-wallet-v4/src/types'
import { connect } from 'react-redux'
import { getBalance } from './selectors'
import { RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { Component } from 'react'
import styled from 'styled-components'

type OwnProps = {
  coin: CoinType
}

type LinkStatePropsType = {
  data: RemoteDataType<
    string,
    {
      balance: number
      max: number
      offers: Array<OfferType>
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
            <FiatDisplay
              weight={600}
              size='32px'
              coin={val.values.coin}
              currency='USD'
            >
              {val.max}
            </FiatDisplay>
          ),
          Failure: e => <Text weight={600}>{e}</Text>,
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
