import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  CurrenciesType,
  FiatEligibleType,
  NabuApiErrorType,
  RemoteDataType
} from 'core/types'
import { RootState } from 'data/rootReducer'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = FiatEligibleType
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
  fiatCurrency: null | keyof CurrenciesType
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class EligibleCheck extends PureComponent<Props, State> {
  state = {}

  componentDidMount () {
    if (this.props.fiatCurrency) {
      this.props.simpleBuyActions.fetchSBFiatEligible(this.props.fiatCurrency)
    }
  }

  render () {
    return this.props.data.cata({
      Success: val => <Success {...val} />,
      Failure: e => <div />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: selectors.components.simpleBuy.getSBFiatEligible(state),
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EligibleCheck)
