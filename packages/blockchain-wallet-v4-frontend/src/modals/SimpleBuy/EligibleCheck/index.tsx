import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FiatEligibleType, NabuApiErrorType, RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

type OwnProps = {}
type SuccessStateType = FiatEligibleType
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class EligibleCheck extends PureComponent<Props, State> {
  state = {}

  render () {
    return <div />
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: selectors.components.simpleBuy.getSBFiatEligible(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EligibleCheck)
