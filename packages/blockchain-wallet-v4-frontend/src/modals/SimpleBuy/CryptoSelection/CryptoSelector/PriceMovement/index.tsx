import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FiatType, PriceMovementDirType, SBPairType } from 'core/types'
import { getCoinFromPair } from 'data/components/simpleBuy/model'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4/src'
import { RootState } from 'data/rootReducer'
import { SkeletonRectangle } from 'blockchain-info-components'
import React, { PureComponent } from 'react'
import styled, { DefaultTheme } from 'styled-components'

const Container = styled.span`
  margin-left: 8px;
`
const Change = styled.span<{ color: keyof DefaultTheme }>`
  font-weight: 500;
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
  componentDidMount () {
    if (!Remote.Success.is(this.props.data)) {
      const coin = getCoinFromPair(this.props.value.pair)
      this.props.miscActions.fetchPrice24H(
        coin,
        this.props.fiatCurrency || 'EUR'
      )
    }
  }

  render () {
    return (
      <Container>
        {this.props.data.cata({
          Success: val => (
            <Change color={getColorFromMovement(val.price24Hr.movement)}>
              {getSignFromMovement(val.price24Hr.movement)}
              {val.price24Hr.change}%
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
  fiatCurrency?: FiatType
  value: SBPairType
}

type Props = OwnProps & ConnectedProps<typeof connector>
type State = {}

export default connector(PriceMovement)
