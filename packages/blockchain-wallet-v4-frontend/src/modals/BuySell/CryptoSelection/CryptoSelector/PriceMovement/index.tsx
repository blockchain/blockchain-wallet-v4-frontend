import React, { memo } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { equals } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled, { DefaultTheme } from 'styled-components'

import { CoinType, FiatType } from '@core/types'
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

const getColorFromMovement = (val: string) => {
  const parsedVal = parseFloat(val)
  if (parsedVal > 0) return 'green600'
  if (parsedVal < 0) return 'red600'
  return 'grey600'
}

const PriceMovement = memo(
  (props: Props) => (
    <Container>
      {props.data.cata({
        Failure: () => null,
        Loading: () => <SkeletonRectangle height='12px' width='40px' />,
        NotAsked: () => null,
        Success: (val) => {
          return <Change color={getColorFromMovement(val)}>{val}%</Change>
        }
      })}
    </Container>
  ),
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
