import { CoinType } from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import { SkeletonRectangle } from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
`
const FiatDisplayTitle = styled(FiatDisplay)`
  display: flex;
  align-items: center;
`
const CoinDisplayTitle = styled(CoinDisplay)`
  display: flex;
  margin-left: 8px;
`

class BalancesMovement extends PureComponent<Props, State> {
  render () {
    return this.props.data.cata({
      Success: val => (
        <Container>
          <FiatDisplayTitle
            coin={this.props.coin}
            size='14px'
            weight={500}
            color='grey800'
          >
            {val.balances[this.props.coin]?.available}
          </FiatDisplayTitle>
          <CoinDisplayTitle
            coin={this.props.coin}
            size='14px'
            weight={500}
            color='grey600'
          >
            {val.balances[this.props.coin]?.available}
          </CoinDisplayTitle>
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
