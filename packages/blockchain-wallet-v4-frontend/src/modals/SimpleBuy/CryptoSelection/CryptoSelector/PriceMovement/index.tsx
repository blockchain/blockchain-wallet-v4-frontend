import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { DefaultTheme } from 'styled-components'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Remote } from 'blockchain-wallet-v4/src'
import {
  CoinType,
  FiatType,
  PriceMovementDirType,
  TimeRange
} from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'

const Container = styled.span`
  margin-left: 4px;
`
const Change = styled.span<{ color: keyof DefaultTheme }>`
  font-weight: 600;
  color: ${props => props.theme[props.color]};
`

const getSignFromMovement = (movement: PriceMovementDirType) => {
  switch (movement) {
    case 'down':
      return '-'
    case 'up':
      return '+'
    default:
      return ''
  }
}

const getColorFromMovement = (movement: PriceMovementDirType) => {
  switch (movement) {
    case 'down':
      return 'red600'
    case 'up':
      return 'green600'
    default:
      return 'grey600'
  }
}

class PriceMovement extends PureComponent<Props, State> {
  componentDidMount() {
    if (!Remote.Success.is(this.props.data)) {
      const coin = this.props.coin
      this.props.miscActions.fetchPriceChange(
        coin,
        this.props.fiat || 'EUR',
        TimeRange.DAY
      )
    }
  }

  render() {
    return (
      <Container>
        {this.props.data.cata({
          Success: val => (
            <Change
              color={getColorFromMovement(val.price24Hr.overallChange.movement)}
            >
              {getSignFromMovement(val.price24Hr.overallChange.movement)}
              {val.price24Hr.overallChange.percentChange}%
            </Change>
          ),
          Loading: () => <SkeletonRectangle height={'12px'} width={'40px'} />,
          Failure: () => null,
          NotAsked: () => null
        })}
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  data: getData(state, ownProps)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  coin: CoinType
  fiat?: FiatType
}

type Props = OwnProps & ConnectedProps<typeof connector>
type State = {}

export default connector(PriceMovement)
