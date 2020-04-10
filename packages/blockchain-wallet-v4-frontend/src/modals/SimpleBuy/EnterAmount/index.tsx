import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  FiatEligibleType,
  FiatType,
  NabuApiErrorType,
  RemoteDataType,
  SBPairType
} from 'core/types'
import { getData } from './selectors'
import { RootState } from 'data/rootReducer'
import Failure from './template.failure'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = {
  eligibility: FiatEligibleType
  pairs: Array<SBPairType>
}
export type LinkDispatchPropsType = {
  formActions: typeof actions.form
  simpleBuyActions: typeof actions.components.simpleBuy
}
export type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
  fiatCurrency: undefined | FiatType
}
export type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class EnterAmount extends PureComponent<Props, State> {
  state = {}

  componentDidMount () {
    if (this.props.fiatCurrency) {
      this.props.simpleBuyActions.fetchSBPairs(this.props.fiatCurrency)
      this.props.simpleBuyActions.fetchSBFiatEligible(this.props.fiatCurrency)
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Failure: () => <Failure {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  formActions: bindActionCreators(actions.form, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EnterAmount)
