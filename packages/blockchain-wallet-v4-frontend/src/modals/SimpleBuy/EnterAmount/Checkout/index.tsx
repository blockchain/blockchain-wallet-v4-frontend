import { connect } from 'react-redux'
import {
  CurrenciesType,
  NabuApiErrorType,
  RemoteDataType,
  SBSuggestedAmountType
} from 'core/types'
import { getData } from './selectors'
import { Props as OwnProps } from '../template.success'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import Loading from './template.loading'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type SuccessStateType = {
  suggestedAmounts: SBSuggestedAmountType
}
type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
}
export type Props = OwnProps & LinkStatePropsType
class Checkout extends PureComponent<Props> {
  state = {}

  componentDidMount () {
    this.props.simpleBuyActions.initializeCheckout(this.props.pairs)
  }

  componentWillUnmount () {
    this.props.simpleBuyActions.fetchSBPairsSuccess([])
  }

  handleSubmit = () => {}

  render () {
    return this.props.data.cata({
      Success: val => (
        <Success {...this.props} {...val} onSubmit={this.handleSubmit} />
      ),
      Failure: e => <div>Oops. Something went wrong.</div>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const enhance = connect(mapStateToProps)

export default enhance(Checkout)
