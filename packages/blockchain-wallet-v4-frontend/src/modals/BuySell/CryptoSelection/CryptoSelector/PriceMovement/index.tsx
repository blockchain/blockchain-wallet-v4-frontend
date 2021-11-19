import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { DefaultTheme } from 'styled-components'

import { Remote } from '@core'
import { CoinType, FiatType, PriceMovementDirType, TimeRange } from '@core/types'
import { SkeletonRectangle } from 'blockchain-info-components'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'

const Container = styled.span`
  margin-left: 4px;
`
const Change = styled.span<{ color: keyof DefaultTheme }>`
  font-weight: 600;
  color: ${(props) => props.theme[props.color]};
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
      const { coin } = this.props
      this.props.miscActions.fetchPriceChange(coin, this.props.fiat || 'EUR', TimeRange.DAY)
    }
  }

  render() {
    return (
      <Container>
        {this.props.data.cata({
          Failure: () => null,
          Loading: () => <SkeletonRectangle height='12px' width='40px' />,
          NotAsked: () => null,
          Success: (val) => (
            <Change color={getColorFromMovement(val.price24Hr.overallChange.movement)}>
              {getSignFromMovement(val.price24Hr.overallChange.movement)}
              {val.price24Hr.overallChange.percentChange}%
            </Change>
          )
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
