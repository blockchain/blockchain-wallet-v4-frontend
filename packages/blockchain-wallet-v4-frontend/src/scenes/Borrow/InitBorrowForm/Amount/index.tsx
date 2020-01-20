import { CoinType } from 'blockchain-wallet-v4/src/types'
import { connect } from 'react-redux'
import { getBalance } from './selectors'
import { RemoteData } from 'blockchain-wallet-v4/src/remote/types'
import { Text } from 'blockchain-info-components'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { Component } from 'react'
import styled from 'styled-components'

type OwnProps = {
  coin: CoinType
}

type LinkStatePropsType = {
  balanceR: RemoteData<string, number>
}

type Props = OwnProps & LinkStatePropsType

const Wrapper = styled.div`
  margin-top: 8px;
`

const Content = styled(Text)`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.theme.grey800};
`;

export class Amount extends Component<Props> {
  state = {}

  render () {
    return (<Wrapper>

      {this.props.balanceR.cata({
        Success: (val) => <FiatDisplay size='32px' weight={600} coin={this.props.coin}>{val}</FiatDisplay>,
        Failure: (e) => <Text weight={600}>{e}</Text>,
        NotAsked: () => <Content>...</Content>,
        Loading: () => <Content>...</Content>
      })}
    </Wrapper>
    )
  }
}

const mapStateToProps = (state, ownProps: OwnProps) => ({
  balanceR: getBalance(state)
})

export default connect(mapStateToProps)(Amount)
