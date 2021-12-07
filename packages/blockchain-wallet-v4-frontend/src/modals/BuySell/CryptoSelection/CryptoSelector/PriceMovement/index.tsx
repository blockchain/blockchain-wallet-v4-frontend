import React, { memo, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { DefaultTheme } from 'styled-components'

import { Remote } from '@core'
import { CoinType, FiatType, PriceMovementDirType, TimeRange } from '@core/types'
import { SkeletonRectangle } from 'blockchain-info-components'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'

const Container = styled.div`
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

const PriceMovement = memo(
  (props: Props) => {
    useEffect(() => {
      const { coin, data, fiat, miscActions } = props
      if (!Remote.Success.is(data)) {
        miscActions.fetchPriceChange(coin, fiat || 'EUR', TimeRange.DAY)
      }
    }, [props])

    return (
      <Container>
        {props.data.cata({
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
  },
  (prevProps, nextProps) => equals(prevProps, nextProps)
)

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

export default connector(PriceMovement)
