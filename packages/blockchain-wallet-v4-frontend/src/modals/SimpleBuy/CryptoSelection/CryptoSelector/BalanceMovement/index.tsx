import { CoinType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { SkeletonRectangle } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.span`
  margin-left: 8px;
`

class BalancesMovement extends PureComponent<Props, State> {
  render () {
    return this.props.data.cata({
      Success: val => (
        <Container>
          <CoinDisplay
            coin={this.props.coin}
            color='grey600'
            size='14px'
            weight={500}
          >
            {val.balances[this.props.coin]?.available}
          </CoinDisplay>
        </Container>
      ),
      Loading: () => <SkeletonRectangle height={'12px'} width={'40px'} />,
      Failure: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

export const mapDispatchToProps = () => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
}

type Props = OwnProps & ConnectedProps<typeof connector>
type State = {}

export default connector(BalancesMovement)
