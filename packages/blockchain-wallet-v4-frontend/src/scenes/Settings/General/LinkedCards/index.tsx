import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { RemoteDataType, SBCardType } from 'core/types'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import Success from './template.success'

class LinkedCards extends PureComponent<Props> {
  componentDidMount () {
    this.props.simpleBuyActions.fetchSBCards()
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} />,
      Loading: () => null,
      Failure: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type SuccessStateType = {
  cards: Array<SBCardType>
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
type Props = ConnectedProps<typeof connector>

export default connector(LinkedCards)
