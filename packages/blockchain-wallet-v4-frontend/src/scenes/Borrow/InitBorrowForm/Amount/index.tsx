import { CoinType } from 'blockchain-wallet-v4/src/types'
import { connect } from 'react-redux'
import { getBalance } from './selectors'
import { RemoteDataType } from 'data/types'
import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { Component } from 'react'
import styled from 'styled-components'

type OwnProps = {
  coin: CoinType
}

type LinkStatePropsType = {
  balanceR: RemoteDataType<string, { totalBalance: string }>
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
        {this.props.balanceR.cata({
          Success: val => (
            <Text weight={600} size='32px'>
              {val.totalBalance}
            </Text>
          ),
          Failure: e => <Text weight={600}>{e}</Text>,
          NotAsked: () => <Content>...</Content>,
          Loading: () => <Content>...</Content>
        })}
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  balanceR: getBalance(state)
})

export default connect(mapStateToProps)(Amount)
